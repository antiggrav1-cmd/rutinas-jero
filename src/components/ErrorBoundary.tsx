import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRecover = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-teal-100 text-center space-y-4 animate-fade-in">
            <div className="bg-teal-100 text-teal-700 w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8 text-teal-600 animate-spin-slow" />
            </div>

            <h2 className="text-xl font-black text-slate-800">
              ¡Ups! Tomemos un respiro 🧘
            </h2>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Ocurrió un pequeño detalle temporal en la pantalla. Tus datos y puntos siguen guardados de forma segura.
            </p>

            <div className="pt-2">
              <button
                onClick={this.handleRecover}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-sm py-3 px-6 rounded-2xl shadow-lg shadow-teal-200 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Continuar Rutina</span>
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <pre className="text-[10px] text-rose-600 bg-rose-50 p-3 rounded-xl text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
