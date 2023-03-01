(() => {

let data = {};

/* --- Filtering --- */

let activeFilters = {
	'role': '',
	'level': '',
	'language': [],
	'tool': []
};

const filtersContainer = document.querySelector('#filters-container');
const filters = document.querySelector('#filters');
const jobs = document.querySelector('#jobs');

// Checks if all values in source array exist target array
function doesArrayContain(target, source) {
	return source.every(value => target.includes(value));
}

// Show/hide job listings based on tags
function filterJobs() {
	// Process each job listing
	const jobListings = jobs.querySelectorAll('.job');
	jobListings.forEach((jobListing) => {
		// Whether job listing should in the results. Assume it is shown by default.
		let displaySetting = 'grid';

		// Keep track of when there are zero or more languages/tools
		let languages = [], tools = [];

		// Process job tags within each job listing
		const jobTags = jobListing.querySelectorAll('.job-tag');
		for (let i = 0; i < jobTags.length; ++i) {
			// Get category name
			const filterCategory = Object.keys(jobTags[i].dataset)[0];

			// Process categories
			switch (filterCategory) {
				case 'role':
					if (activeFilters.role.length && jobTags[i].dataset.role !== activeFilters.role) {
						displaySetting = 'none';
					}
					break;
				case 'level':
					if (activeFilters.level.length && jobTags[i].dataset.level !== activeFilters.level) {
						displaySetting = 'none';
					}
					break;
				case 'language':
					languages.push(jobTags[i].dataset.language);
					break;
				case 'tool':
					tools.push(jobTags[i].dataset.tool);
					break;
			}
		}

		// Determine if job listing should be displayed once all job tags have been processed
		const languageContains = doesArrayContain(languages, activeFilters.language);
		//const languageContains = activeFilters.language.includesAll(languages);
		if (activeFilters.language.length && !languageContains) {
			displaySetting = 'none';
		}

		// Determine if job listing should be displayed once all job tags have been processed
		const toolContains = doesArrayContain(tools, activeFilters.tool);
		//const toolContains = activeFilters.tool.includesAll(tools);
		if (activeFilters.tool.length && !toolContains) {
			displaySetting = 'none';
		}

		// Finally, show/hide job listing based on job tags processing
		jobListing.style.display = displaySetting;
	});
}

function removeFilter(e) {
	const filterCategory = Object.keys(e.currentTarget.dataset)[0];

	// Update active filters object
	if (filterCategory === 'role' || filterCategory === 'level') {
		activeFilters[filterCategory] = '';
	} else {
		const index = activeFilters[filterCategory].indexOf(e.currentTarget.dataset[filterCategory]);
		activeFilters[filterCategory].splice(index, 1);
	}

	// Remove filter from active filters in DOM
	const activeFiltersInContainer = filters.querySelectorAll('.button-remove-filter');
	activeFiltersInContainer.forEach((filter) => {
		if (filter.dataset[filterCategory] === e.currentTarget.dataset[filterCategory]) {
			filters.removeChild(filter.parentNode);
		}
	});
	if (filters.children.length === 0) {
		filtersContainer.style.display = 'none';
	}

	// Refresh list
	filterJobs();
}

function createFilter(filterCategory, filterName) {
	const filter = document.createElement('div');
	filter.className = 'filter';

	const filterLabel = document.createElement('span');
	filterLabel.className = 'filter-name';
	filterLabel.innerText = filterName;
	filter.appendChild(filterLabel);

	const filterButton = document.createElement('button');
	filterButton.className = 'button-remove-filter';
	filterButton.setAttribute(`data-${filterCategory}`, filterName);
	filterButton.addEventListener('click', removeFilter);

	const filterButtonImage = document.createElement('img');
	filterButtonImage.src = './images/icon-remove.svg';
	filterButtonImage.width = '14';
	filterButtonImage.height = '14';
	filterButtonImage.alt = '';
	
	filterButton.appendChild(filterButtonImage);
	filter.appendChild(filterButton);

	if (filters.children.length === 0) {
		filtersContainer.style.display = 'flex';
	}

	filters.appendChild(filter);
}

function toggleFilter(e) {
	const filterCategory = Object.keys(e.currentTarget.dataset)[0];
	const filterIndex = activeFilters[filterCategory].indexOf(e.target.innerText);
	if (filterIndex !== -1) {
		if (filterCategory === 'role' || filterCategory === 'level') {
			activeFilters[filterCategory] = '';
		} else {
			activeFilters[filterCategory].splice(filterIndex, 1);
		}
		removeFilter(e);
	} else {
		if (filterCategory === 'role' || filterCategory === 'level') {
			activeFilters[filterCategory] = e.target.innerText;
		} else {
			activeFilters[filterCategory].push(e.target.innerText);
		}

		createFilter(filterCategory, e.target.innerText);
	}

	filterJobs(e.target.innerText);
}

function clearFilters() {
	activeFilters = {
		'role': '',
		'level': '',
		'language': [],
		'tool': []
	};
	filters.innerHTML = '';
	filtersContainer.style.display = 'none';

	const jobListings = jobs.querySelectorAll('.job');
	jobListings.forEach((jobListing) => {
		jobListing.style.display = 'grid';
	});
}

function selectJob(e) {
	e.preventDefault();
	const job = e.currentTarget.parentNode.parentNode;
	if (!job.classList.contains('job-selected')) {
		job.classList.add('job-selected');
	} else {
		job.classList.remove('job-selected');
	}
}

document.querySelector('#button-clear-filters')
	.addEventListener('click', clearFilters);

/* --- Job Postings --- */

// Create job post
function createJob(data) {
	const job = document.createElement('article');
	job.className = 'job';
	//article.classList.add('job-selected');

	// Employer Logo
	const jobLogo = document.createElement('img');
	jobLogo.src = data.logo;
	jobLogo.width = '88';
	jobLogo.height = '88';
	jobLogo.alt = '';
	jobLogo.className = 'job-logo';
	job.appendChild(jobLogo);

	const jobDetailsContainer = document.createElement('div');
	jobDetailsContainer.className = 'job-details-container';

	const jobEmployerContainer = document.createElement('div');
	jobEmployerContainer.className = 'job-employer-container';

	// Employer Name
	const jobEmployerName = document.createElement('h2');
	jobEmployerName.className = 'job-employer';
	jobEmployerName.innerText = data.company;
	jobEmployerContainer.appendChild(jobEmployerName);

	// Employer Tags
	if (data.new || data.featured) {
		const jobEmployerTags = document.createElement('ul');
		jobEmployerTags.className = 'job-employer-tags';

		if (data.new) {
			const jobEmployerTag = document.createElement('li');
			jobEmployerTag.className = 'job-employer-tag';
			jobEmployerTag.innerText = 'New!';
			jobEmployerTags.appendChild(jobEmployerTag);
		}

		if (data.featured) {
			const jobEmployerTag = document.createElement('li');
			jobEmployerTag.className = 'job-employer-tag';
			jobEmployerTag.classList.add('tag-featured');
			jobEmployerTag.innerText = 'Featured';
			jobEmployerTags.appendChild(jobEmployerTag);
		}

		jobEmployerContainer.appendChild(jobEmployerTags);
	}

	jobDetailsContainer.appendChild(jobEmployerContainer);

	// Job Title
	const jobTitle = document.createElement('a');
	jobTitle.className = 'job-title';
	jobTitle.innerText = data.position;
	jobTitle.href = '#';
	jobTitle.addEventListener('click', selectJob);
	jobDetailsContainer.appendChild(jobTitle);

	// Job Info
	const jobInfo = document.createElement('ul');
	jobInfo.className = 'job-info';

	const jobInfoPostedAt = document.createElement('li');
	jobInfoPostedAt.innerText = data.postedAt;
	jobInfo.appendChild(jobInfoPostedAt);

	const jobInfoContract = document.createElement('li');
	jobInfoContract.innerText = data.contract;
	jobInfo.appendChild(jobInfoContract);

	const jobInfoLocation = document.createElement('li');
	jobInfoLocation.innerText = data.location;
	jobInfo.appendChild(jobInfoLocation);

	jobDetailsContainer.appendChild(jobInfo);
	job.appendChild(jobDetailsContainer);

	// Job Tags
	const jobTags = document.createElement('ul');
	jobTags.className = 'job-tags';

	if (data.role) {
		const jobTag = document.createElement('li');
		const jobTagButton = document.createElement('button');
		jobTagButton.className = 'job-tag';
		jobTagButton.innerText = data.role;
		jobTagButton.setAttribute('data-role', data.role);
		jobTagButton.addEventListener('click', toggleFilter);
		jobTag.appendChild(jobTagButton);
		jobTags.appendChild(jobTag);
	}

	if (data.level) {
		const jobTag = document.createElement('li');
		const jobTagButton = document.createElement('button');
		jobTagButton.className = 'job-tag';
		jobTagButton.innerText = data.level;
		jobTagButton.setAttribute('data-level', data.level);
		jobTagButton.addEventListener('click', toggleFilter);
		jobTag.appendChild(jobTagButton);
		jobTags.appendChild(jobTag);
	}

	data.languages.forEach((language) => {
		const jobTag = document.createElement('li');
		const jobTagButton = document.createElement('button');
		jobTagButton.className = 'job-tag';
		jobTagButton.innerText = language;
		jobTagButton.setAttribute('data-language', language);
		jobTagButton.addEventListener('click', toggleFilter);
		jobTag.appendChild(jobTagButton);
		jobTags.appendChild(jobTag);
	});

	data.tools.forEach((tool) => {
		const jobTag = document.createElement('li');
		const jobTagButton = document.createElement('button');
		jobTagButton.className = 'job-tag';
		jobTagButton.innerText = tool;
		jobTagButton.setAttribute('data-tool', tool);
		jobTagButton.addEventListener('click', toggleFilter);
		jobTag.appendChild(jobTagButton);
		jobTags.appendChild(jobTag);
	});

	job.appendChild(jobTags);

	jobs.appendChild(job);
}

function renderData() {
	data.forEach((job) => {
		createJob(job);
	});
}

/* --- JSON Data Load --- */

function loadJSON() {
	fetch('data.json')
		.then((response) => response.json())
		.then((json) => {
			data = json;
			renderData();
		});
}

loadJSON();

})();