import { useMutation } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const esewaPaymentUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

// generate signature function
const generateSignature = (
  total_amount: string,
  transaction_uuid: string,
  product_code: string,
  secret: string
) => {
  const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = CryptoJS.HmacSHA256(hashString, secret);
  const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
  return hashedSignature;
};

const handleEsewaCallForm = (formData: Record<string, string>) => {
  const form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", esewaPaymentUrl);

  for (const key in formData) {
    const hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", formData[key]);
    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
};

const defaultFormData: { [key: string]: string } = {
  amount: "0",
  failure_url: "https://developer.esewa.com.np/failure",
  product_delivery_charge: "0",
  product_service_charge: "0",
  product_code: "EPAYTEST",
  signed_field_names: "total_amount,transaction_uuid,product_code",
  success_url: "https://developer.esewa.com.np/success",
  tax_amount: "0",
  total_amount: "0",
  transaction_uuid: uuidv4(),
  secret: "8gBm/:&EnhH.1/q",
};

const usePayment = ({ amount }: { amount: string }) => {
  const { url } = useLocation();

  const finalPaymentData = {
    ...defaultFormData,
    amount: amount,
    total_amount: amount,
    success_url: url,
    signature: generateSignature(
      amount,
      defaultFormData.transaction_uuid,
      defaultFormData.product_code,
      defaultFormData.secret
    ),
  };

  const { mutate: initialPayment, isPending: isPaymentProcessing } =
    useMutation({
      mutationFn: async () => {
        handleEsewaCallForm(finalPaymentData);
      },
      onSuccess: async () => {
        //success
      },
      onError: (err: AxiosError<{ errors?: { email?: string } }>) => {
        console.error(err);
      },
    });

  return {
    initialPayment,
    isPaymentProcessing,
  };
};

export default usePayment;
