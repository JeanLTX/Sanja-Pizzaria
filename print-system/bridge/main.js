const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');

const APP_NAME = 'Impressão';
const DEFAULT_PRINT_LAYOUT = Object.freeze({
    paperWidthMm: 80,
    columns: 48,
    leftMargin: 0,
    topPadding: 0,
    bottomPadding: 2,
    lineSpacing: 0,
    headerAlignment: 'center',
    showPhone: true,
    showAddress: true,
    showRegion: true,
    showPayment: true,
    showNotes: true
});
const CONFIG_PATH = app.isPackaged
    ? path.join(app.getPath('userData'), 'config.json')
    : path.join(__dirname, 'config.json');
const LOG_PATH = path.join(app.getPath('userData'), 'bridge.log');
const PRINT_STATE_PATH = path.join(app.getPath('userData'), 'print-state.json');

let tray;
let windowRef;
let timer;
let busy = false;
let config = null;

function log(message, error) {
    const suffix = error ? ` | ${error.stack || error.message || error}` : '';
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, `[${new Date().toISOString()}] ${message}${suffix}\n`, 'utf8');
    console.log(message, error || '');
}

function loadPrintState() {
    try {
        if (!fs.existsSync(PRINT_STATE_PATH)) return { pendingCompletions: [] };
        const value = JSON.parse(fs.readFileSync(PRINT_STATE_PATH, 'utf8'));
        return {
            pendingCompletions: Array.isArray(value.pendingCompletions) ? value.pendingCompletions : []
        };
    } catch (error) {
        log('Não foi possível ler o estado local de impressão', error);
        return { pendingCompletions: [] };
    }
}

function savePrintState(state) {
    fs.mkdirSync(path.dirname(PRINT_STATE_PATH), { recursive: true });
    fs.writeFileSync(PRINT_STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function rememberPrintedJob(job) {
    const state = loadPrintState();
    if (!state.pendingCompletions.some(item => item.jobId === job.job_id)) {
        state.pendingCompletions.push({
            jobId: job.job_id,
            orderId: job.order_id,
            orderNumber: job.order_number,
            printedAt: new Date().toISOString()
        });
        savePrintState(state);
    }
}

function forgetPrintedJob(jobId) {
    const state = loadPrintState();
    state.pendingCompletions = state.pendingCompletions.filter(item => item.jobId !== jobId);
    savePrintState(state);
}

async function flushPendingCompletions() {
    const state = loadPrintState();
    if (!state.pendingCompletions.length || !config?.bridgeToken) return;

    for (const item of [...state.pendingCompletions]) {
        try {
            const ok = await completeJob(item.jobId, true);
            if (ok !== false) {
                forgetPrintedJob(item.jobId);
                log(`Confirmação recuperada para o pedido #${item.orderNumber || '-'}.`);
            }
        } catch (error) {
            log(`Ainda não foi possível confirmar o pedido #${item.orderNumber || '-'}.`, error);
            break;
        }
    }
}

function normalizeConfig(raw) {
    return {
        ...raw,
        printLayout: {
            ...DEFAULT_PRINT_LAYOUT,
            ...(raw?.printLayout || {})
        }
    };
}

function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        const examplePath = path.join(__dirname, 'config.example.json');
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
        fs.copyFileSync(examplePath, CONFIG_PATH);
    }

    return normalizeConfig(JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')));
}

function validateBaseConfig() {
    if (!config?.supabaseUrl) throw new Error('Servidor não configurado.');
    if (!config?.supabaseKey || config.supabaseKey.includes('COLOQUE_')) {
        throw new Error('Chave do servidor não configurada.');
    }
}

function validateConfig() {
    validateBaseConfig();
    if (!config?.bridgeToken || config.bridgeToken.includes('COLOQUE_')) {
        throw new Error('Este computador ainda não foi ativado.');
    }
}

function getFriendlyRpcError(status, body, functionName) {
    let data = null;
    try { data = JSON.parse(body); } catch {}

    const code = data?.code || '';
    const message = String(data?.message || '').trim();

    if (message === 'Código de ativação inválido, expirado ou já utilizado.') {
        return 'Esse código de ativação é inválido, expirou ou já foi utilizado.';
    }

    if (message === 'Código de ativação inválido.') {
        return 'Digite um código de ativação válido.';
    }

    if (message === 'Estabelecimento inativo.') {
        return 'Este estabelecimento está inativo e não pode ser ativado.';
    }

    if (code === '23505' && functionName === 'activate_bridge') {
        return 'Este computador já está cadastrado para este estabelecimento.';
    }

    if (status === 401 || status === 403) {
        return 'Não foi possível autorizar esta operação. Verifique a configuração do aplicativo.';
    }

    if (status >= 500) {
        return 'O servidor encontrou um problema. Tente novamente em alguns instantes.';
    }

    if (message && /^[A-Za-zÀ-ÿ0-9\s.,;:!?()/_-]{4,180}$/.test(message)) {
        return message;
    }

    return 'Não foi possível concluir esta operação. Tente novamente.';
}

async function callPublicRpc(functionName, payload) {
    validateBaseConfig();

    const response = await fetch(
        `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${functionName}`,
        {
            method: 'POST',
            headers: {
                apikey: config.supabaseKey,
                Authorization: `Bearer ${config.supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );

    const body = await response.text();
    if (!response.ok) {
        log(`RPC pública ${functionName} falhou (${response.status})`, new Error(body));
        throw new Error(getFriendlyRpcError(response.status, body, functionName));
    }
    return body ? JSON.parse(body) : null;
}

async function callRpc(functionName, payload) {
    validateConfig();

    const response = await fetch(
        `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${functionName}`,
        {
            method: 'POST',
            headers: {
                apikey: config.supabaseKey,
                Authorization: `Bearer ${config.supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );

    const body = await response.text();

    if (!response.ok) {
        log(`RPC ${functionName} falhou (${response.status})`, new Error(body));
        throw new Error(getFriendlyRpcError(response.status, body, functionName));
    }

    return body ? JSON.parse(body) : null;
}

async function heartbeat() {
    return callRpc('heartbeat_bridge', {
        p_token: config.bridgeToken,
        p_version: app.getVersion(),
        p_device_name: os.hostname()
    });
}

async function claimNextJob() {
    return callRpc('claim_print_job', {
        p_token: config.bridgeToken
    });
}

async function completeJob(jobId, success, errorMessage = null) {
    return callRpc('complete_print_job', {
        p_token: config.bridgeToken,
        p_job_id: jobId,
        p_success: success,
        p_error_message: errorMessage
    });
}

async function listRecentJobs(limit = 24) {
    return callRpc('list_recent_print_jobs', {
        p_token: config.bridgeToken,
        p_limit: limit
    });
}

async function requestReprint(jobId) {
    const job = await callRpc('request_reprint_now', {
        p_token: config.bridgeToken,
        p_job_id: jobId
    });

    if (!job) {
        throw new Error('Não foi possível preparar a reimpressão deste pedido.');
    }

    try {
        const result = await printWithWindows(job);
        if (!result.test) rememberPrintedJob(job);
        try {
            await completeJob(job.job_id, true);
            if (!result.test) forgetPrintedJob(job.job_id);
        } catch (confirmError) {
            if (result.test) throw confirmError;
            log(`Reimpressão do pedido ${job.order_id} concluída, mas confirmação pendente.`, confirmError);
        }
        return { test: !!result.test, output: result.output || null, jobId: job.job_id };
    } catch (error) {
        try { await completeJob(job.job_id, false, error.message); } catch {}
        throw error;
    }
}

async function activateBridge(code) {
    const result = await callPublicRpc('activate_bridge', {
        p_code: code,
        p_device_name: os.hostname(),
        p_version: app.getVersion()
    });

    if (!result?.bridgeToken) {
        throw new Error('O servidor não retornou uma ativação válida.');
    }

    config = {
        ...config,
        bridgeToken: result.bridgeToken,
        establishmentId: result.establishmentId,
        establishmentName: result.establishmentName,
        printerId: result.printerId,
        autoPrint: false,
        testMode: true
    };

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return config;
}

async function createTestOrder() {
    return callRpc('create_test_order', {
        p_token: config.bridgeToken
    });
}

async function printSpecificJob(jobId) {
    const job = await callRpc('claim_specific_print_job', {
        p_token: config.bridgeToken,
        p_job_id: jobId
    });

    if (!job) {
        throw new Error('Este pedido não está disponível para impressão agora.');
    }

    try {
        const result = await printWithWindows(job);
        await completeJob(job.job_id, true);
        return { test: !!result.test, output: result.output || null, jobId: job.job_id };
    } catch (error) {
        await completeJob(job.job_id, false, error.message);
        throw error;
    }
}

function buildReceipt(job) {
    const money = value => Number(value || 0).toFixed(2).replace('.', ',');
    const establishment = String(config.establishmentName || 'ESTABELECIMENTO').toUpperCase();
    const centeredName = establishment.slice(0, 28).padStart(Math.ceil((28 + establishment.length) / 2), ' ').padEnd(28, ' ');

    return [
        '================================',
        centeredName,
        '          NOVO PEDIDO',
        '================================',
        `Pedido: #${job.order_number || '-'}`,
        `Cliente: ${job.customer_name || '-'}`,
        job.customer_phone ? `Telefone: ${job.customer_phone}` : null,
        '--------------------------------',
        ...(job.items || []).flatMap(item => [
            `${item.quantity}x ${item.product_name}`,
            item.options?.details ? `  ${item.options.details}` : null,
            item.notes ? `  Obs: ${item.notes}` : null,
            `  Valor: R$ ${money(Number(item.unit_price) * Number(item.quantity))}`,
            ''
        ]),
        '--------------------------------',
        `Subtotal: R$ ${money(job.subtotal)}`,
        `Entrega: R$ ${money(job.delivery_fee)}`,
        `TOTAL: R$ ${money(job.total)}`,
        '--------------------------------',
        job.delivery_region ? `Região: ${job.delivery_region}` : null,
        job.address ? `Endereço: ${job.address}` : null,
        job.payment_method ? `Pagamento: ${job.payment_method}` : null,
        job.notes ? `Obs: ${job.notes}` : null,
        '================================',
        '',
        ''
    ].filter(Boolean).join('\r\n');
}

function formatReceiptOutput(raw) {
    const layout = { ...DEFAULT_PRINT_LAYOUT, ...(config.printLayout || {}) };
    const columns = Math.max(24, Math.min(64, Number(layout.columns) || DEFAULT_PRINT_LAYOUT.columns));
    const margin = ' '.repeat(Math.max(0, Math.min(20, Number(layout.leftMargin) || 0)));
    const spacing = Math.max(0, Math.min(3, Number(layout.lineSpacing) || 0));
    const separators = new Set(['================================', '--------------------------------']);
    const hidePrefix = [
        !layout.showPhone && 'Telefone:',
        !layout.showAddress && 'Endereço:',
        !layout.showRegion && 'Região:',
        !layout.showPayment && 'Pagamento:',
        !layout.showNotes && 'Obs:'
    ].filter(Boolean);

    const wrapLine = line => {
        const text = String(line ?? '');
        if (!text.trim() || separators.has(text.trim())) return [text];
        const chunks = [];
        let rest = text.trimStart();
        while (rest.length > columns) {
            let cut = rest.lastIndexOf(' ', columns);
            if (cut < 10) cut = columns;
            chunks.push(rest.slice(0, cut));
            rest = rest.slice(cut).trimStart();
        }
        chunks.push(rest);
        return chunks;
    };

    const source = raw.split(/\r?\n/).filter(line => !hidePrefix.some(prefix => line.trimStart().startsWith(prefix)));

    const content = [];
    const headerLimit = 2;
    let headerIndex = 0;

    for (const original of source) {
        const clean = original.trim();
        if (separators.has(clean)) {
            content.push('-'.repeat(columns));
            continue;
        }
        const isHeader = headerIndex < headerLimit && clean && !clean.includes(':');
        const pieces = wrapLine(original);
        for (const piece of pieces) {
            if (isHeader) content.push(alignPrintLine(piece, columns, layout.headerAlignment));
            else content.push(piece.slice(0, columns));
        }
        if (clean) headerIndex++;
    }

    const final = [];
    for (let i = 0; i < Math.max(0, Math.min(20, Number(layout.topPadding) || 0)); i++) final.push('');
    for (const line of content) {
        final.push(margin + line);
        for (let i = 0; i < spacing; i++) final.push(margin);
    }
    for (let i = 0; i < Math.max(0, Math.min(10, Number(layout.bottomPadding) || 0)); i++) final.push('');
    return final.join('\r\n');
}

function alignPrintLine(text, columns, mode) {
    const value = String(text ?? '').slice(0, columns);
    const total = Math.max(0, columns - value.length);
    if (mode === 'right') return ' '.repeat(total) + value;
    if (mode === 'center') return ' '.repeat(Math.floor(total / 2)) + value + ' '.repeat(Math.ceil(total / 2));
    return value.padEnd(columns, ' ');
}

function printWithWindows(job) {
    return new Promise((resolve, reject) => {
        const receipt = formatReceiptOutput(buildReceipt(job));
        if (config.testMode) {
            const output = path.join(app.getPath('userData'), `teste-pedido-${Date.now()}.txt`);
            fs.writeFileSync(output, receipt, 'utf8');
            return resolve({ test: true, output });
        }

        if (!config.printerName) {
            return reject(new Error('Nenhuma impressora foi selecionada. Vá em Impressora e escolha uma antes de imprimir.'));
        }

        const tempFile = path.join(os.tmpdir(), `jean-print-${job.job_id}.txt`);
        fs.writeFileSync(tempFile, receipt, 'utf8');

        const ps = '$ErrorActionPreference="Stop"; ' +
            `Get-Content -Raw -LiteralPath ${JSON.stringify(tempFile)} | Out-Printer -Name ${JSON.stringify(config.printerName)}`;

        execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps], { windowsHide: true }, (error, stdout, stderr) => {
            try { fs.unlinkSync(tempFile); } catch {}
            if (error) {
                log('Falha no envio para a impressora', new Error(stderr || error.message));
                return reject(new Error('Não foi possível enviar a comanda para a impressora. Verifique se ela está ligada, conectada e selecionada no aplicativo.'));
            }
            resolve({ test: false });
        });
    });
}

async function processQueueOnce() {
    // No modo de teste, não consumimos a fila automática: o pedido continua pendente
    // até que o usuário faça uma impressão manual pelo painel.
    if (busy || !config.autoPrint || config.testMode) return;
    busy = true;

    try {
        const job = await claimNextJob();
        if (!job) return;

        log(`Pedido ${job.order_id} reservado.`);

        try {
            const result = await printWithWindows(job);

            if (result.test) {
                await completeJob(job.job_id, true);
                log(`TESTE: recibo salvo em ${result.output}; pedido marcado como printed.`);
                return;
            }

            // Persistimos localmente antes de confirmar no servidor.
            // Se a internet cair depois da impressão física, o Bridge
            // consegue confirmar o mesmo job quando a conexão voltar,
            // evitando que ele seja reservado novamente.
            rememberPrintedJob(job);

            try {
                await completeJob(job.job_id, true);
                forgetPrintedJob(job.job_id);
                log(`Pedido ${job.order_id} impresso e confirmado com sucesso.`);
            } catch (confirmError) {
                log(`Pedido ${job.order_id} foi impresso, mas a confirmação ficou pendente.`, confirmError);
            }
        } catch (error) {
            try {
                await completeJob(job.job_id, false, error.message);
            } catch (completeError) {
                log(`Não foi possível registrar a falha de impressão de ${job.order_id}`, completeError);
            }
            log(`Falha ao imprimir ${job.order_id}`, error);
        }
    } catch (error) {
        log('Falha na fila de impressão', error);
    } finally {
        busy = false;
    }
}

async function refreshStatus() {
    try {
        const ok = await heartbeat();
        if (!ok) throw new Error('Este computador foi desativado pelo administrador.');
        await flushPendingCompletions();
        updateTray('🟢 Impressão — Online');
        if (windowRef && !windowRef.isDestroyed()) {
            windowRef.webContents.send('status', { online: true, message: 'Conectado ao Supabase.' });
        }
    } catch (error) {
        const disabled = /desativado/i.test(error.message || '');
        updateTray(disabled ? '⛔ Impressão — Desativado' : '🔴 Impressão — Offline');
        if (windowRef && !windowRef.isDestroyed()) {
            windowRef.webContents.send('status', { online: false, disabled, message: error.message });
        }
        log(disabled ? 'Computador desativado pelo administrador' : 'Heartbeat falhou', error);
    }
}

function updateTray(title) {
    tray?.setToolTip(title);
}

function createWindow() {
    windowRef = new BrowserWindow({
        width: 1180,
        height: 760,
        minWidth: 980,
        minHeight: 680,
        resizable: true,
        show: false,
        backgroundColor: '#0b1220',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    windowRef.loadFile(path.join(__dirname, 'renderer.html'));

    windowRef.on('close', event => {
        if (!app.isQuitting) {
            event.preventDefault();
            windowRef.hide();
        }
    });
}

function createTray() {
    tray = new Tray(nativeImage.createEmpty());
    tray.setToolTip(APP_NAME);
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Abrir Impressão',
            click: () => windowRef?.show()
        },
        {
            label: 'Verificar conexão',
            click: () => refreshStatus()
        },
        { type: 'separator' },
        {
            label: 'Abrir pasta de dados',
            click: () => shell.openPath(app.getPath('userData'))
        },
        {
            label: 'Sair',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]));
}

ipcMain.handle('list-printers', async () => {
    return new Promise((resolve, reject) => {
        execFile('powershell.exe', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            'Get-Printer | Select-Object -ExpandProperty Name | ConvertTo-Json -Compress'
        ], { windowsHide: true }, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr || error.message));
            try {
                if (!stdout.trim()) return resolve([]);
                const value = JSON.parse(stdout);
                resolve(Array.isArray(value) ? value : [value]);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
});

ipcMain.handle('open-data-folder', () => shell.openPath(app.getPath('userData')));

ipcMain.handle('save-config', (_event, nextConfig) => {
    config = { ...config, ...nextConfig };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return config;
});

ipcMain.handle('get-config', () => config);

ipcMain.handle('activate-bridge', async (_event, code) => activateBridge(String(code || '').trim()));

ipcMain.handle('create-test-order', async () => createTestOrder());

ipcMain.handle('list-jobs', async (_event, limit) => {
    return listRecentJobs(Number(limit) || 24);
});

ipcMain.handle('reprint-job', async (_event, jobId) => {
    const ok = await requestReprint(jobId);
    if (!ok) throw new Error('Não foi possível solicitar a reimpressão deste pedido.');
    return true;
});

ipcMain.handle('print-specific-job', async (_event, jobId) => {
    return printSpecificJob(jobId);
});

ipcMain.handle('test-print', async () => {
    if (!config.printerName && !config.testMode) {
        throw new Error('Selecione uma impressora antes de testar.');
    }

    const testJob = {
        order_number: 'TESTE',
        customer_name: 'Impressão de teste',
        customer_phone: null,
        items: [
            {
                quantity: 1,
                product_name: 'Teste de impressão',
                unit_price: 0,
                options: { details: 'Jean Print System' },
                notes: null
            }
        ],
        subtotal: 0,
        delivery_fee: 0,
        total: 0,
        delivery_region: null,
        address: null,
        payment_method: null,
        notes: 'Se esta página foi impressa corretamente, a impressora está pronta.'
    };

    const result = await printWithWindows(testJob);
    log(result.test
        ? `Teste simulado concluído: ${result.output}`
        : 'Teste real enviado para a impressora.'
    );
    return result;
});

app.whenReady().then(async () => {
    config = loadConfig();

    // Inicia automaticamente com o Windows somente na versão empacotada.
    // O aplicativo não abre uma janela na inicialização; permanece na bandeja.
    if (app.isPackaged && process.platform === 'win32') {
        app.setLoginItemSettings({
            openAtLogin: true,
            enabled: true,
            name: APP_NAME,
            path: process.execPath,
            args: []
        });
    }

    createWindow();
    createTray();

    if (process.argv.includes('--show') || !config.bridgeToken || config.bridgeToken.includes('COLOQUE_')) {
        windowRef.show();
    }

    await refreshStatus();

    timer = setInterval(async () => {
        await refreshStatus();
        await processQueueOnce();
    }, Math.max(1000, Number(config.pollIntervalMs) || 3000));
});

app.on('before-quit', () => {
    app.isQuitting = true;
    if (timer) clearInterval(timer);
});

app.on('window-all-closed', event => event.preventDefault());
