import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Mail } from "lucide-react"

export function SubscribeBanner() {
  return (
    <div className="bg-[#1e293b] rounded-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="md:w-2/3">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-[#e11d48]" />
            Stay Updated
          </h3>
          <p className="text-[#94a3b8]">
            Subscribe to our newsletter to receive the latest news, updates, and exclusive content from Bodega Esports.
          </p>
        </div>

        <div className="md:w-1/3">
          <form className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-[#0f172a] border-[#0f172a] text-[#f8fafc]"
              required
            />
            <Button className="bg-[#e11d48] hover:bg-[#e11d48]/90 text-white whitespace-nowrap">Subscribe</Button>
          </form>
          <p className="text-xs text-[#94a3b8] mt-2">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </div>
  )
} 