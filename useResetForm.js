const useResetForm = (
  setFormData,
  initialFormData,
  fieldErrors,
  setFieldErrors,
  onClose,
  setIsPoEdited
) => {
  const resetForm = () => {
    // Reset form data to initial state
    setFormData(initialFormData);

    // Reset field errors if they exist
    if (fieldErrors) {
      setFieldErrors((prevErrors) => {
        const updatedErrors = {};
        for (const key in prevErrors) {
          if (prevErrors.hasOwnProperty(key)) {
            updatedErrors[key] = false;
          }
        }
        return updatedErrors;
      });
    }

    onClose();
    setIsPoEdited(false);
  };

  return { resetForm };
};

export default useResetForm;
