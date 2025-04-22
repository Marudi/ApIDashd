
import { ApiDefinition } from "./types";

// Convert ApiDefinition[] to XML string
export function apiDefsToXml(apis: ApiDefinition[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?><ApiDefinitions>';
  apis.forEach(api => {
    xml += `
      <ApiDefinition>
        <id>${escapeXml(api.id)}</id>
        <name>${escapeXml(api.name)}</name>
        <listenPath>${escapeXml(api.listenPath)}</listenPath>
        <targetUrl>${escapeXml(api.targetUrl)}</targetUrl>
        <protocol>${escapeXml(api.protocol)}</protocol>
        <active>${api.active}</active>
        <authType>${escapeXml(api.authType)}</authType>
        <lastUpdated>${escapeXml(api.lastUpdated)}</lastUpdated>
        <createdAt>${escapeXml(api.createdAt)}</createdAt>
        ${
          api.versioningInfo
            ? `<versioningInfo>
                <enabled>${api.versioningInfo.enabled}</enabled>
                <versions>
                  ${api.versioningInfo.versions
                    .map(
                      v => `<version>
                        <name>${escapeXml(v.name)}</name>
                        <id>${escapeXml(v.id)}</id>
                        ${v.expires ? `<expires>${escapeXml(v.expires)}</expires>` : ''}
                      </version>`
                    )
                    .join("")}
                </versions>
              </versioningInfo>`
            : ""
        }
        ${
          api.rateLimit
            ? `<rateLimit>
                <rate>${api.rateLimit.rate}</rate>
                <per>${api.rateLimit.per}</per>
                <enabled>${api.rateLimit.enabled}</enabled>
              </rateLimit>`
            : ""
        }
        ${
          api.quota
            ? `<quota>
                <max>${api.quota.max}</max>
                <rate>${api.quota.rate}</rate>
                <per>${api.quota.per}</per>
                <enabled>${api.quota.enabled}</enabled>
              </quota>`
            : ""
        }
      </ApiDefinition>
    `;
  });
  xml += '</ApiDefinitions>';
  return xml;
}

// Convert XML string to ApiDefinition[]
export function xmlToApiDefs(xmlStr: string): ApiDefinition[] {
  if (typeof window === "undefined" || !window.DOMParser)
    throw new Error("XML parser not available");
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlStr, "application/xml");
  const defs = Array.from(xml.getElementsByTagName("ApiDefinition"));
  return defs.map(def => {
    const get = (tag: string) => def.getElementsByTagName(tag)?.[0]?.textContent || "";
    const getBool = (v: string) => v === "true" || v === "1";
    const getInt = (v: string) => Number(v);

    // Handle versions (optional)
    let versioningInfo;
    const versioningElem = def.getElementsByTagName("versioningInfo")?.[0];
    if (versioningElem) {
      const enabled = getBool(versioningElem.getElementsByTagName("enabled")[0]?.textContent || "");
      const versionsElem = versioningElem.getElementsByTagName("versions")[0];
      const versions = versionsElem
        ? Array.from(versionsElem.getElementsByTagName("version")).map(v => ({
            name: v.getElementsByTagName("name")[0]?.textContent || "",
            id: v.getElementsByTagName("id")[0]?.textContent || "",
            expires: v.getElementsByTagName("expires")[0]?.textContent || undefined,
          }))
        : [];
      versioningInfo = { enabled, versions };
    }

    // Handle rateLimit (optional)
    let rateLimit;
    const rlElem = def.getElementsByTagName("rateLimit")?.[0];
    if (rlElem) {
      rateLimit = {
        rate: getInt(rlElem.getElementsByTagName("rate")[0]?.textContent || "0"),
        per: getInt(rlElem.getElementsByTagName("per")[0]?.textContent || "0"),
        enabled: getBool(rlElem.getElementsByTagName("enabled")[0]?.textContent || ""),
      };
    }

    // Handle quota (optional)
    let quota;
    const quotaElem = def.getElementsByTagName("quota")?.[0];
    if (quotaElem) {
      quota = {
        max: getInt(quotaElem.getElementsByTagName("max")[0]?.textContent || "0"),
        rate: getInt(quotaElem.getElementsByTagName("rate")[0]?.textContent || "0"),
        per: getInt(quotaElem.getElementsByTagName("per")[0]?.textContent || "0"),
        enabled: getBool(quotaElem.getElementsByTagName("enabled")[0]?.textContent || ""),
      };
    }

    return {
      id:           get("id"),
      name:         get("name"),
      listenPath:   get("listenPath"),
      targetUrl:    get("targetUrl"),
      protocol:     get("protocol"),
      active:       getBool(get("active")),
      versioningInfo,
      authType:     get("authType") as any,
      rateLimit,
      quota,
      lastUpdated:  get("lastUpdated"),
      createdAt:    get("createdAt"),
    };
  });
}

function escapeXml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
