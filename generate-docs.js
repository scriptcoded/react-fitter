import { parse } from "react-docgen";
import { readFile, writeFile } from "node:fs/promises";

const componentFile = "lib/Fitter.tsx";
const outputFile = "README.md";

const componentCode = await readFile(componentFile, "utf-8");
const [documentation] = parse(componentCode);

const tableRows = [];

for (const [name, prop] of Object.entries(documentation.props ?? {})) {
	const typeName = prop.tsType?.name ?? prop.flowType?.name;
	const defaultValue = prop.defaultValue?.value
		? `\`${prop.defaultValue?.value}\``
		: "";
	const defaultColumn = prop.required ? "(required)" : defaultValue;
	const description = (prop.description ?? "")
		.replace(/\n/g, " ")
		.replace(/\s+/g, " ");

	const columns = [
		`\`${name}\``,
		`\`${typeName}\``,
		defaultColumn,
		description,
	];

	tableRows.push(columns.join(" | "));
}

const tableHeader = ["Prop name", "Type", "Default value", "Description"].join(
	" | ",
);
const tableDivider = ["---", "---", "---", "---"].join(" | ");
const table = [tableHeader, tableDivider, ...tableRows].join("\n");

const outputContent = await readFile(outputFile, "utf-8");
const newContent = outputContent.replace(
	/<!-- PROPS_TABLE_START -->.*<!-- PROPS_TABLE_END -->/s,
	`<!-- PROPS_TABLE_START -->\n${table}\n<!-- PROPS_TABLE_END -->`,
);
await writeFile(outputFile, newContent);
