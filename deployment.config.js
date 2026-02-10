const { execSync } = require("child_process");

const name = process.env.npm_package_name;
const version = process.env.npm_package_version;

// Upload chunks -> set cache-control default value -> set public read access
execSync(`gsutil -m cp -r -z css,js,map ./dist/prod/chunks-${version} gs://bubbi-js-bucket/${name}/v1`);
execSync(`gsutil -m setmeta -r -h cache-control gs://bubbi-js-bucket/${name}/v1/chunks-${version}`);
execSync(`gsutil acl ch -r -u AllUsers:R gs://bubbi-js-bucket/${name}/v1/chunks-${version}/`);

// Upload pixel -> set cache-control default value -> set public read access
execSync(`gsutil -m cp -r -z css,js,map ./dist/prod/js gs://bubbi-js-bucket/${name}/v1`);
execSync(`gsutil -m setmeta -r -h cache-control gs://bubbi-js-bucket/${name}/v1/js`);
execSync(`gsutil acl ch -r -u AllUsers:R gs://bubbi-js-bucket/${name}/v1/js`);
