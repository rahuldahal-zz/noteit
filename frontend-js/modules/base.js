export default class Base {
    constructor() {
        this.classTogglers = Array.from(document.querySelectorAll('[data-trigger-type="toggle"]'));
        this.classAdders = Array.from(document.querySelectorAll('[data-trigger-type="add"]'));
        this.classRemovers = Array.from(document.querySelectorAll('[data-trigger-type="remove"]'));
        this.events();
    }

    events() {
        if (this.classTogglers.length) {
            this.classTogglers.forEach((toggler) => {
                toggler.addEventListener("click", e => {
                    e.preventDefault();
                    this.classStateHandler("toggle", toggler.dataset.triggerTarget, toggler.dataset.triggerAction);
                })
            })
        }

        if (this.classAdders.length) {
            this.classAdders.forEach((adder) => {
                adder.addEventListener("click", e => {
                    e.preventDefault();
                    this.classStateHandler("add", adder.dataset.triggerTarget, adder.dataset.triggerAction);
                })
            })
        }

        if (this.classRemovers.length) {
            this.classRemovers.forEach((remover) => {
                remover.addEventListener("click", e => {
                    e.preventDefault();
                    this.classStateHandler("remove", remover.dataset.triggerTarget, remover.dataset.triggerAction);
                })
            })
        }
    }

    classStateHandler(type, target, action) {
        if (!type || !target || !action) return -1;

        this.targetElement = document.getElementById(target);
        console.log(this.targetElement);

        if (type === "add") this.targetElement.classList.add(action);
        if (type === "remove") this.targetElement.classList.remove(action);
        if (type === "toggle") this.targetElement.classList.toggle(action);
    }
}