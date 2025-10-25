import fs from 'fs';
import core from '@actions/core';
import github from '@actions/github';

try {
	const token = process.env.GITHUB_TOKEN;
	const octokit = github.getOctokit(token);
	const tag = `v${core.getInput('version')}`;

	const { data: release } = await octokit.rest.repos.getReleaseByTag({
		owner: github.context.repo.owner,
		repo: github.context.repo.repo,
		tag,
	});

	const asset = release.assets.find((a) => a.name.startsWith('demo-') && a.name.endsWith('.zip'));
	if (!asset) core.setFailed(`No demo asset found for ${tag}`);

	const response = await octokit.request({
		url: asset.url,
		headers: { Accept: 'application/octet-stream' },
	});

	fs.writeFileSync(asset.name, Buffer.from(response.data));
	core.setOutput('file', asset.name);
} catch (error) {
	core.setFailed(error.message);
}
