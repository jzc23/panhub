export const onRequest = async ({ request, env }) => {
  // 从环境变量获取认证信息（避免硬编码）
  const USERNAME = env.BASIC_USER;
  const PASSWORD = env.BASIC_PASS;

  // 验证环境变量是否配置
  if (!USERNAME || !PASSWORD) {
    return new Response("Authentication not configured", { status: 500 });
  }

  // 解析请求头中的认证信息
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' }
    });
  }

  // 验证凭证
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic") {
    return new Response("Invalid authentication scheme", { status: 401 });
  }

  const decoded = atob(encoded);
  const [username, password] = decoded.split(":");
  if (username !== USERNAME || password !== PASSWORD) {
    return new Response("Invalid credentials", { status: 401 });
  }

  // 认证通过，继续处理请求
  return await env.ASSETS.fetch(request);
};
