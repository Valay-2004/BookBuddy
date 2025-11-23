import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
    </div>
  );
}
