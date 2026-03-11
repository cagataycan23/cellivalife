import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "./server";

export interface CRMContact {
  id: string;
  full_name: string;
  email: string;
  country?: string;
  lifecycle_stage?: string;
  owner_id?: string;
  last_event_at?: string;
  created_at?: string;
}

export interface PipelineDeal {
  id: string;
  title: string;
  value: number;
  stage_id: string;
  owner_id?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
  deals: PipelineDeal[];
}

export interface CRMTask {
  id: string;
  title: string;
  due_date: string;
  status: "open" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  assignee_id?: string;
  related_contact_id?: string;
}

const CONTACT_PAGE_SIZE = 25;

export async function fetchContacts(options: { search?: string; stage?: string; page?: number } = {}) {
  const { search, stage, page = 0 } = options;
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("crm_contacts")
    .select("id, full_name, email, country, lifecycle_stage, owner_id, last_event_at, created_at")
    .order("last_event_at", { ascending: false })
    .range(page * CONTACT_PAGE_SIZE, page * CONTACT_PAGE_SIZE + CONTACT_PAGE_SIZE - 1);

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,country.ilike.%${search}%`
    );
  }
  if (stage) {
    query = query.eq("lifecycle_stage", stage);
  }

  const { data, error }: PostgrestSingleResponse<CRMContact[]> = await query;
  if (error) throw error;
  return data;
}

export async function fetchPipelineBoard(pipelineId: string) {
  const supabase = getSupabaseAdmin();
  const stagesRes = await supabase
    .from("crm_pipeline_stages")
    .select("id, stage_name, stage_order")
    .eq("pipeline_id", pipelineId)
    .order("stage_order", { ascending: true });

  if (stagesRes.error) throw stagesRes.error;

  const dealsRes = await supabase
    .from("crm_pipeline")
    .select("id, title, weighted_value, stage_id, owner_id")
    .eq("pipeline_id", pipelineId);

  if (dealsRes.error) throw dealsRes.error;

  const stageMap: Record<string, PipelineStage> = {};
  for (const stage of stagesRes.data ?? []) {
    stageMap[stage.id] = {
      id: stage.id,
      name: stage.stage_name,
      order_index: stage.stage_order,
      deals: [],
    };
  }

  for (const deal of dealsRes.data ?? []) {
    if (!stageMap[deal.stage_id]) continue;
    stageMap[deal.stage_id].deals.push({
      id: deal.id,
      title: deal.title,
      value: deal.weighted_value,
      stage_id: deal.stage_id,
      owner_id: deal.owner_id,
    });
  }

  return Object.values(stageMap).sort((a, b) => a.order_index - b.order_index);
}

export async function fetchOpenTasks(limit = 20) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("crm_tasks")
    .select("id, title, due_date, status, priority, assignee_id, related_contact_id")
    .neq("status", "completed")
    .order("due_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as CRMTask[];
}

export async function completeTask(taskId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("crm_tasks")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw error;
}

export async function logNotification(input: { contactId: string; message: string; channel: string }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("fn_insert_notification", {
    contact_uuid: input.contactId,
    message: input.message,
    channel: input.channel,
  });

  if (error) throw error;
  return data as string;
}
