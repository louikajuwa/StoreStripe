import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';

const NotificationContext = createContext(null);

export function useNotify() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotify must be used within <NotificationProvider>');
    return ctx;
}

export default function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirmState, setConfirmState] = useState(null);
    const idRef = useRef(0);
    const resolveRef = useRef(null);

    const dismissToast = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(({ message, type = 'info', duration = 3500 }) => {
        const id = ++idRef.current;
        setToasts((list) => [...list, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => dismissToast(id), duration);
        }
        return id;
    }, [dismissToast]);

    const confirm = useCallback((opts) => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setConfirmState(opts);
        });
    }, []);

    const resolveConfirm = useCallback((value) => {
        setConfirmState(null);
        if (resolveRef.current) {
            resolveRef.current(value);
            resolveRef.current = null;
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ toast, confirm }}>
            {children}

            <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto">
                        <Toast toast={t} onDismiss={() => dismissToast(t.id)} />
                    </div>
                ))}
            </div>

            {confirmState && (
                <ConfirmModal state={confirmState} onResolve={resolveConfirm} />
            )}
        </NotificationContext.Provider>
    );
}
