import { MapPin, Search } from "lucide-react";
import ErrorMessage from "../common/ErrorMessage";
import LoadingButton from "../common/LoadingButton";
import SectionCard from "../common/SectionCard";

export default function AddressSearch({ address, setAddress, loading, error, onSearch }) {
  return (
    <SectionCard>
      <div className="mb-5 flex items-center gap-3">
        <MapPin className="text-blue-600" />
        <h3 className="text-lg font-semibold">Police Department Location</h3>
      </div>
      <form onSubmit={onSearch} className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter police department address, city, country..."
          aria-label="Police department address"
          required
          maxLength={200}
          className="flex-1 rounded-lg border border-slate-300 p-4 outline-none focus:border-blue-500"
        />
        <LoadingButton 
          type="submit" 
          loading={loading} 
          loadingText="Searching..." 
          icon={<Search size={18} />}
        >
          Analyze Location
        </LoadingButton>
      </form>
      <ErrorMessage message={error} />
    </SectionCard>
  );
}
