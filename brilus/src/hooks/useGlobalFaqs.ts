import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GlobalFaq {
  id: string;
  question: string;
  answer: string;
  order_index: number | null;
}

export const useGlobalFaqs = () => {
  return useQuery({
    queryKey: ["faqs", "global"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer, order_index")
        .eq("visible", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []) as GlobalFaq[];
    },
  });
};
