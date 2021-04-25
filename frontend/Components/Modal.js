import React, { createRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");
modalRoot.classList.add("modal");

export default function Modal({
  shouldOpen,
  classToToggle,
  transitionDuration = 300,
  children,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { modal: modalClass, child: childClass } = classToToggle;

  function doAfterOpen() {
    if (!modalRoot.children[0]) {
      return null;
    }
    modalRoot.classList.add(modalClass);
    modalRoot.children[0].classList.add(childClass);
    return undefined;
  }

  function doBeforeClose() {
    if (!modalRoot.children[0]) {
      return null;
    }
    modalRoot.classList.remove(modalClass);
    modalRoot.children[0].classList.remove(childClass);
    setTimeout(() => {
      setIsModalOpen(false);
    }, transitionDuration);
    return undefined;
  }

  useEffect(() => {
    if (shouldOpen) {
      doAfterOpen();
      setIsModalOpen(true);
    }
  }, [shouldOpen]);

  if (isModalOpen && !shouldOpen) {
    doBeforeClose();
    return createPortal(children, modalRoot);
  }

  if (!shouldOpen) return null;

  return createPortal(children, modalRoot);
}
