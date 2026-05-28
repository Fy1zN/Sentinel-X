const BASE_URL = "http://127.0.0.1:8000";

export async function getThreatFeed(
    token: string
) {

    const response = await fetch(
        `${BASE_URL}/threats/feed`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}


export async function getDashboardStats(
    token: string
) {

    const response = await fetch(
        `${BASE_URL}/dashboard/dashboard/stats`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
}