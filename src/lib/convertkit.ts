interface SubscribeParams {
  email: string;
  firstName: string;
  tags?: Record<string, string>;
}

export async function subscribeToConvertKit({
  email,
  firstName,
  tags,
}: SubscribeParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    console.warn("ConvertKit not configured — skipping subscription");
    return { success: true };
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          first_name: firstName,
          fields: tags,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Subscription failed" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
