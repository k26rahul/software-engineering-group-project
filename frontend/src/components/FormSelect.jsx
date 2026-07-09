import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Select an option",
  triggerId,
  className = "w-full",
  required = false,
}) {
  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger id={triggerId} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
