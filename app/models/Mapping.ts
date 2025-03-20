import {
	Model,
	type InferAttributes,
	type InferCreationAttributes,
} from "sequelize";

export class MappingModel extends Model<
	InferAttributes<MappingModel>,
	InferCreationAttributes<MappingModel>
> {
	declare id: number;
	declare discordChannel: string;
	declare revoltChannel: string;
	declare discordChannelName: string;
	declare revoltChannelName: string;
	declare allowBots?: boolean;
}
