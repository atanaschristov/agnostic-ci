import bem from 'bem-cn';

import './AppVersion.scss';

const AppVersion = () => {
	const b = bem('version-info');

	return (
		<table className={b()}>
			<tbody>
				<tr>
					<td>DEMO</td>
					<td>: {__DEMO_VERSION__}</td>
				</tr>
				<tr>
					<td>LIB</td>
					<td>: {__LIB_VERSION__}</td>
				</tr>
			</tbody>
		</table>
	);
};

export default AppVersion;
