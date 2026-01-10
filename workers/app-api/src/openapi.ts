import YAML from "yaml";
import openapiYaml from "../../../docs/api/stillroot-api.v1.openapi.yaml";

export const OPENAPI_DOCUMENT = YAML.parse(openapiYaml) as unknown;

