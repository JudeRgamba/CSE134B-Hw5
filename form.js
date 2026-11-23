/**
 * Validate the entries within the form.
 * Create custom error messages for each field.
 */

const form = document.querySelector(".validation-form");

const fields = [
    document.querySelector("#fname"),
    document.querySelector("#lname"),
    document.querySelector("#email"),
    document.querySelector("#user-comment")
];

const comments = document.querySelector("#user-comment");
const commentInfo = document.querySelector("#comment-info");

const errorAreas = new Map([
    [fields[0], document.querySelector("#fname-error")],
    [fields[1], document.querySelector("#lname-error")],
    [fields[2], document.querySelector("#email-error")],
    [fields[3], document.querySelector("#comment-error")]
]);

const form_errors = [];
const errorHistoryInput = document.querySelector("#form-errors");

const editedFields = new Set();
const checkedFields = new Set();

let submitAttempted = false;

function validateField(field) {
    // Always clear the the previous custom error before checking
    field.setCustomValidity("");

    const label = field.labels[0].textContent.trim().replace(/:$/, "");
    const validity = field.validity;

    let message = "";

    if (validity.valueMissing) {
        message = `${label}: Please enter a value`;
    } else if (validity.typeMismatch) {
        message = `${label}: Enter an email address such as john@example.com.`;
    } else if (
        validity.tooShort ||
        (
            field.minLength > 0 &&
            field.value.length > 0 &&
            field.value.length < field.minLength
        )
    ) {
        message = `${label}: Enter at least ${field.minLength} character. ` +
                    `You currently have ${field.value.length}.`;
    } else if (validity.tooLong) {
        message = `${label}: Use no more than ${field.maxLength} characters.`;
    } else if (!validity.valid) {
        message = `${label}: ${field.validationMessage}`;
    }

    field.setCustomValidity(message);

    const errorArea = errorAreas.get(field);

    // Avoid rewriting unchanged feedback
    if (errorArea.textContent !== message) {
        errorArea.textContent = message;
    }

    if (message) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }

    return field.validity.valid;
}

function updateCommentInfo() {
    const remaining = comments.maxLength - comments.value.length;
    const warningThreshold = 100;

    commentInfo.classList.toggle(
        "near-limit",
        remaining > 0 && remaining <= warningThreshold
    );

    commentInfo.classList.toggle("at-limit", remaining === 0);

    if (remaining === 0) {
        commentInfo.textContent = 
            `Character limit reached(${comments.maxLength}). ` +
            "Delete text to continue typing."
    } else if (remaining <= warningThreshold) {
        commentInfo.textContent = 
        `Near character limit: ${remaining} characters remaining.`;
    } else {
        commentInfo.textContent = `${remaining} characters remaining.`;
    }
}

fields.forEach((field) => {
    field.addEventListener("input", () => {
        editedFields.add(field);

        // Once feedback has been shown, keep it updated while typing
        if (submitAttempted || checkedFields.has(field)) {
            validateField(field);
        }

        if (field === comments) {
            updateCommentInfo();
        }
    });

    field.addEventListener("blur", () => {
        // Do not show errors only because an untouched field lost focus.
        if (editedFields.has(field) || submitAttempted) {
            checkedFields.add(field);
            validateField(field);
        }
    });
});

form.addEventListener("submit", (event) => {
    submitAttempted = true;

    const invalidFields = [];

    fields.forEach((field) => {
        if (!validateField(field)) {
            invalidFields.push(field);
        }
    })

    if (invalidFields.length > 0) {
        event.preventDefault();

        invalidFields.forEach((field) => {
            form_errors.push({
                field: field.name,
                error: errorAreas.get(field).textContent
            });
        });

        return;
    }

    // Preserve the standard POST submission
    errorHistoryInput.value = JSON.stringify(form_errors);
});

updateCommentInfo();

form.querySelectorAll(".form-feedback").forEach((area) => {
    area.hidden = false;
});

// If javascript fails to load, always fall back to the native HTML
form.noValidate = true;