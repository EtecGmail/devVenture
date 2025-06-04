export const formatCPF = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const isCPFValid = (value: string): boolean => {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rest = sum % 11;
  const dv1 = rest < 2 ? 0 : 11 - rest;
  if (parseInt(cpf.charAt(9)) !== dv1) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rest = sum % 11;
  const dv2 = rest < 2 ? 0 : 11 - rest;
  return parseInt(cpf.charAt(10)) === dv2;
};
