import { createPortal } from 'react-dom';
import type { HTMLAttributes, ReactNode } from 'react';
import './Dialog.css';

export const Dialog = ({
  className = '',
  open,
  title,
  actions,
  handleClose,
  dividers,
  dividerTop = true,
  dividerBottom = false,
  dialogActionProps,
  dialogContentProps,
  headerActions,
  children,
  position = 'center',
}: DialogProps) => {
  if (!open) return null;
  const modalClassname = `claymate-modal ${className} ${position}`;
  return createPortal(
    <div
      className="claymate-modal-wrapper"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
    >
      <div className={modalClassname} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2 className="typography">{title}</h2>
          {headerActions && (
            <div className="header-actions">{headerActions}</div>
          )}
        </div>

        {(dividers || dividerTop) && <div className="divider" />}

        <div className="modal-content" {...dialogContentProps}>
          {children}
        </div>

        {(dividers || dividerBottom) && <div className="divider" />}

        <div className="modal-actions" {...dialogActionProps}>
          {actions}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export interface DialogProps {
  className?: string;
  open: boolean;
  title: string;
  actions?: ReactNode;
  handleClose: () => void;
  dividers?: boolean;
  dividerTop?: boolean;
  dividerBottom?: boolean;
  dialogActionProps?: HTMLAttributes<HTMLDivElement>;
  dialogContentProps?: HTMLAttributes<HTMLDivElement>;
  headerActions?: ReactNode;
  children: ReactNode;
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'left'
    | 'center'
    | 'right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right';
}
