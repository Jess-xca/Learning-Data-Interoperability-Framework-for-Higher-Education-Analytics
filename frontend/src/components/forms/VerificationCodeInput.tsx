interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

const fieldClass =
  "w-full h-12 pl-4 pr-4 bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface rounded-t-lg transition-all font-medium outline-none";

export default function VerificationCodeInput({
  value,
  onChange,
  maxLength = 6,
  placeholder = "000000",
}: VerificationCodeInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-secondary">
        Verification Code *
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${fieldClass} text-center text-2xl tracking-[0.5em] font-bold`}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <p className="text-xs text-on-surface-variant">
        The code will be valid for 10 minutes
      </p>
    </div>
  );
}
