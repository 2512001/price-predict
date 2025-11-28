import { useState, useCallback } from 'react';

const useForm = (initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (validate) {
        const validationErrors = validate({
          ...values,
          [name]: value,
        });
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    },
    [values, validate]
  );

  const handleBlur = useCallback(
    (e) => {
      if (!validate) return;

      const { name } = e.target;
      const validationErrors = validate(values);
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
      }));
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (onSubmit) => {
      return async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validate) {
          const validationErrors = validate(values);
          setErrors(validationErrors);

          if (Object.keys(validationErrors).length > 0) {
            setIsSubmitting(false);
            return;
          }
        }

        try {
          await onSubmit(values);
          setValues(initialState);
          setErrors({});
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            submit: error.message,
          }));
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, initialState, validate]
  );

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
};

export default useForm; 