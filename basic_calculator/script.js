const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
let currentInput = "";

function updateDisplay(value) {
    display.textContent = value || "0";
}

function calculate() {
    try {
        let result = eval(currentInput);
        if (!isFinite(result)) throw new Error("Math Error");
        currentInput = result.toString();
        updateDisplay(currentInput);
    } catch {
        updateDisplay("Error");
        currentInput = "";
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (value === "C") {
            currentInput = "";
            updateDisplay("");
        } else if (value === "=") {
            calculate();
        } else if ("+-*/".includes(value)) {
            if (currentInput === "" || "+-*/".includes(currentInput.slice(-1))) {
                return;
            }
            currentInput += value;
            updateDisplay(currentInput);
        } else {
            currentInput += value;
            updateDisplay(currentInput);
        }
    });
});

document.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || "+-*/.".includes(e.key)) {
        currentInput += e.key;
        updateDisplay(currentInput);
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    } else if (e.key === "Escape") {
        currentInput = "";
        updateDisplay("");
    }
});
