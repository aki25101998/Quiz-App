-- Cấp quyền cho user được phép XÓA các bài làm của chính họ
CREATE POLICY "Users can delete their own results" 
ON public.quiz_results 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
