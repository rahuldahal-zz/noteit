import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");
modalRoot.classList.add("modal");

export default function Modal({
  shouldOpen,
  classToToggle,
  transitionDuration = 300,
  setStateRef,
  children,
}) {
  const [modalState, setModalState] = useState("initial");
  const { modal: modalClass, child: childClass } = classToToggle;

  function pushStateToHistory() {
    const url = new URL(window.location.href);
    url.hash = "modal-open";
    window.history.pushState({}, "", url);
  }

  function doAfterOpen() {
    if (!modalRoot.children[0]) {
      return null;
    }
    pushStateToHistory();
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
      setModalState("closed");
      setStateRef(false);
    }, transitionDuration);
    return undefined;
  }

  useEffect(() => {
    window.addEventListener("popstate", doBeforeClose);
    window.addEventListener("keyup", (e) => {
      e.stopImmediatePropagation();
      if (e.key === "Escape") {
        window.history.back();
      }
    });
  }, []);

  useEffect(() => {
    console.log({ modalState });
    if (modalState === "open") {
      doAfterOpen();
    } else if (modalState === "closed") {
      window.removeEventListener("popstate", doBeforeClose);
    }
  }, [modalState]);

  useEffect(() => {
    if (shouldOpen) {
      setModalState("open");
    }
  }, [shouldOpen]);

  if (modalState === "open" && !shouldOpen) {
    doBeforeClose();
    return createPortal(children, modalRoot);
  }

  if (!shouldOpen || modalState === "closed") {
    modalRoot.classList.remove(modalClass);
    return null;
  }

  return createPortal(children, modalRoot);
}
