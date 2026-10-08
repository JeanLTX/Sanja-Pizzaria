// Cliente REST mínimo para o Jean Print System.
// Usa apenas a Publishable Key no navegador. A Secret Key nunca deve ser colocada aqui.

const getSupabaseHeaders = () => {
    const config = window.SUPABASE_CONFIG || {};
    if (!config.url || !config.publishableKey) {
        throw new Error('Configuração do Supabase não encontrada.');
    }

    return {
        apikey: config.publishableKey,
        Authorization: `Bearer ${config.publishableKey}`,
        'Content-Type': 'application/json'
    };
};

async function supabaseRest(path, options = {}) {
    const config = window.SUPABASE_CONFIG || {};
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
        ...options,
        headers: {
            ...getSupabaseHeaders(),
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Supabase ${response.status}: ${body || response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

async function saveOrderToSupabase() {
    const config = window.SUPABASE_CONFIG || {};
    const establishmentId = config.establishmentId;
    if (!establishmentId) {
        throw new Error('Estabelecimento do Supabase não configurado.');
    }

    const total = getCartTotal() + getDeliveryFee();

    const orderId = crypto.randomUUID();

    const order = {
        id: orderId,
        establishment_id: establishmentId,
        customer_name: checkoutData.name,
        customer_phone: checkoutData.phone,
        order_type: 'delivery',
        address: checkoutData.address,
        delivery_region: checkoutData.deliveryRegion?.name || null,
        delivery_fee: Number(getDeliveryFee().toFixed(2)),
        payment_method: checkoutData.paymentMethod,
        notes: null,
        subtotal: Number(getCartTotal().toFixed(2)),
        total: Number(total.toFixed(2)),
        status: 'received'
    };

    const items = cart.map(item => ({
        order_id: orderId,
        product_id: item.id != null ? String(item.id) : null,
        product_name: item.name,
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.price || 0),
        options: {
            details: item.details || '',
            type: item.type || ''
        },
        notes: item.note || null
    }));

    try {
        const rpcPayload = {
            p_establishment_id: establishmentId,
            p_customer_name: order.customer_name,
            p_customer_phone: order.customer_phone,
            p_address: order.address,
            p_delivery_region: order.delivery_region,
            p_delivery_fee: order.delivery_fee,
            p_payment_method: order.payment_method,
            p_subtotal: order.subtotal,
            p_total: order.total,
            p_items: items
        };

        const createdOrderId = await supabaseRest('rpc/create_public_order', {
            method: 'POST',
            body: JSON.stringify(rpcPayload)
        });
        return createdOrderId || orderId;
    } catch (error) {
        console.error('Falha ao registrar pedido:', error);
        throw new Error('Não foi possível registrar o pedido agora. Confira sua conexão e tente novamente.');
    }
}

window.saveOrderToSupabase = saveOrderToSupabase;
