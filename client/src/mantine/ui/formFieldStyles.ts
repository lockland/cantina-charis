/** Estilo comum dos campos de formulário da app (antes no tema global). */
export const appFormFieldStyles = {
  label: { color: "var(--main-color)" },
  input: { border: "none" as const, borderRadius: 0 },
}

export const appDatePickerFieldStyles = {
  label: { color: "var(--main-color)" },
  input: {
    border: "none" as const,
    borderRadius: 0,
    backgroundColor: "white",
  },
}

export const appFormLabelOnlyStyles = {
  label: { color: "var(--main-color)" },
}
