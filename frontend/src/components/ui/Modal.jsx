"use client"

export function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className = "" }) {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
}

export function ModalContent({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function ModalFooter({ children, className = "" }) {
  return <div className={`px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 ${className}`}>{children}</div>
}
