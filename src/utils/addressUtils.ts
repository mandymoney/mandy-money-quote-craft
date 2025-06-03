
interface AddressComponents {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export const formatDisplayAddress = (address: AddressComponents): string => {
  const parts = [
    address.streetNumber,
    address.streetName,
    address.suburb,
    address.state,
    address.postcode
  ].filter(Boolean);
  return parts.join(' ');
};
