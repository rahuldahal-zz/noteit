import React, { createRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

export default function Modal({
  shouldOpen,
  classToToggle,
  transitionDuration = 300,
  children,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function doAfterOpen() {
    if (!modalRoot.children[0]) {
      return null;
    }
    modalRoot.children[0].classList.add(classToToggle);
    return undefined;
  }

  function doBeforeClose() {
    if (!modalRoot.children[0] || !classToToggle) {
      return null;
    }
    modalRoot.children[0].classList.remove(classToToggle);
    setTimeout(() => {
      setIsModalOpen(false);
    }, transitionDuration);
    return undefined;
  }

  useEffect(() => {
    if (shouldOpen) {
      classToToggle && doAfterOpen();
      setIsModalOpen(true);
    }
  }, [shouldOpen]);

  if (classToToggle && isModalOpen && !shouldOpen) {
    doBeforeClose();
    return createPortal(children, modalRoot);
  }

  if (!shouldOpen) return null;

  return createPortal(children, modalRoot);
}
