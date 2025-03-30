import * as ReactDOM from "react-dom";
import "./Dialog.css";

export const Dialog: React.FC<DialogProps> = ({
  className = "",
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
  position = "center"
}) => {
  if (!open) return null;
  const modalClassname = `claymate-modal ${className} ${position}`;
  return ReactDOM.createPortal(
    <div className="claymate-modal-wrapper">
      <div className={modalClassname}>
        <div className="modal-header">
          <h2 className="typography">{title}</h2>
          {headerActions && <div className="header-actions">{headerActions}</div>}
          <button className="close-button" onClick={handleClose}>
            X
          </button>
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
    document.body
  );
};

export interface DialogProps {
  className?: string;
  open: boolean;
  title: string;
  actions?: React.ReactNode;
  handleClose: () => void;
  dividers?: boolean;
  dividerTop?: boolean;
  dividerBottom?: boolean;
  dialogActionProps?: React.HTMLAttributes<HTMLDivElement>;
  dialogContentProps?: React.HTMLAttributes<HTMLDivElement>;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "left"
    | "center"
    | "right"
    | "bottom-left"
    | "bottom"
    | "bottom-right";
}
