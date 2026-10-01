import {
  createIcons,
  ShoppingCart,
  Clock,
  MapPin,
  ShoppingBag,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle,
  CheckCircle2,
  Pizza,
  ChevronDown,
  PlusCircle,
  Moon,
  Trash2,
  ShoppingBasket
} from 'lucide';

const icons = {
  ShoppingCart,
  Clock,
  MapPin,
  ShoppingBag,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle,
  CheckCircle2,
  Pizza,
  ChevronDown,
  PlusCircle,
  Moon,
  Trash2,
  ShoppingBasket
};

function renderIcons(options = {}) {
  return createIcons({ icons, ...options });
}

window.lucide = { createIcons: renderIcons };
renderIcons();
