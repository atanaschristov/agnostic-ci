interface IListProps {
	paths: string[];
}

export const List = (props: IListProps) => {
	const { paths } = props;

	return (
		<ol>
			{paths.map((path) => (
				<li key={path}>{path.replace('../../../../assets/documentation/', '')}</li>
			))}
		</ol>
	);
};
