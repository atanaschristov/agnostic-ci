interface IListProps {
	paths: string[];
}

const ListDocumentsAction = (props: IListProps) => {
	const { paths } = props;

	return (
		<ol>
			{paths.map((path) => (
				<li key={path}>{path.replace('../../assets/documentation/', '')}</li>
			))}
		</ol>
	);
};

export default ListDocumentsAction;
