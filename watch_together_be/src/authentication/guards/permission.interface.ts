import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { PermissionTitle } from "./permission.enum";

export interface Permission {
    title: PermissionTitle;
    subject?: EntityClassOrSchema
}