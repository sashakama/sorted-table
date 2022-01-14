const appRoot = document.getElementById('app-root');
const header = buildHeader();
appRoot.append(header);

function buildHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Countries Search</h1>
        <form action="javascript:">
        <div class="type-row">
            <p>Please choose the type of search:</p>
            <div id="type-radio-group">
                <label><input type="radio" name="search-type" value="Region">By Region</label>
                <label><input type="radio" name="search-type" value="Language">By Language</label>
            </div>
        </div>
        <div class="query-row">
            <label>Please choose search query:
                <select id="select" disabled>
                    <option value="Select value">Select value</option>
                </select>
            </label>
        </div>
        </form>
        <p id="table-placeholder">No items, please choose search query</p>
    `
    const select = header.querySelector('#select');
    header.querySelector('#type-radio-group').onchange = function (event) {
        fillSelect(select, event.target.value);
        fillTable(select.dataset.type, select.value, 'name');
    }
    select.onchange = function () {
        fillTable(select.dataset.type, select.value, 'name');
    }
    return header;
}

function fillSelect(select, type) {
    select.disabled = false;
    select.dataset.type = type;
    if (type === 'Region') {
        clearSelect(select);
        const regions = externalService.getRegionsList();
        regions.forEach(elem => {
            addElements(elem, select);
        });
    }
    if (type === 'Language') {
        clearSelect(select);
        const languages = externalService.getLanguagesList();
        languages.forEach(elem => {
            addElements(elem, select);
        });
    }
}

function addElements(elem, select) {
    let newOption = document.createElement('option');
    newOption.innerHTML = elem;
    newOption.setAttribute('value', `${elem}`);
    select.append(newOption);
}

function clearSelect(select) {
    let options = document.getElementsByTagName('option');
    if (options.length > 1) {
        for (let i = options.length - 1; i >= 1; i -= 1) {
            select.removeChild(options[i]);
        }
    }
}

function buildTable() {
    const table = document.createElement('table');
    table.id = 'table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Country name<span id="country_name" data-sort-column ="name">↑</span></th>
                <th>Capital</th>
                <th>World region</th>
                <th>Languages</th>
                <th>Area<span id="area" data-sort-column ="area">↕</span></th>
            </tr>
        </thead>
        <tbody></tbody>
    `
    table.onclick = function (e) {
        if (e.target.id === 'country_name') {
            let elem = e.target;
            const reversed = elem.dataset.sortColumn === table.dataset.sortColumn;
            fillTable(table.dataset.type, table.dataset.value, elem.dataset.sortColumn, reversed);
        }
        if (e.target.id === 'area') {
            let elem = e.target;
            const reversed = elem.dataset.sortColumn === table.dataset.sortColumn;
            fillTable(table.dataset.type, table.dataset.value, elem.dataset.sortColumn, reversed);
        }
    }
    return table;
}

function fillTable(type, value, sortColumn, reversed) {
    const negativeOne = -1;
    if (document.getElementById('table')) {
        appRoot.removeChild(document.getElementById('table'));
    }
    const table = buildTable();
    Object.assign(table.dataset, { type, value, sortColumn });
    if (reversed) {
        delete table.dataset.sortColumn;
    }
    const tablePlaceholder = header.querySelector('#table-placeholder');
    if (value === 'Select value') {
        table.hidden = true;
        tablePlaceholder.hidden = false;
        return;
    }
    if (type === 'Region') {
        const countries = externalService.getCountryListByRegion(value);
        countries.sort((c1, c2) => c1[sortColumn] > c2[sortColumn] ? 1 : negativeOne);
        if (reversed) {
            countries.reverse();
        }
        countries.forEach(element => {
            addElemTd(element, table);
        });
    }
    if (type === 'Language') {
        const countries = externalService.getCountryListByLanguage(value);
        countries.sort((c1, c2) => c1[sortColumn] > c2[sortColumn] ? 1 : negativeOne);
        if (reversed) {
            countries.reverse();
        }
        countries.forEach(element => {
            addElemTd(element, table);
        });

    }
    tablePlaceholder.hidden = true;
    appRoot.append(table);
    table.querySelector('#country_name').innerText = sortColumn !== 'name' ? '↕' : '↑';
    table.querySelector('#country_name').innerText;
    if (sortColumn !== 'name') {
        table.querySelector('#country_name').innerText = '↕';
    } else if (reversed) {
        table.querySelector('#country_name').innerText = '↓';
    } else {
        table.querySelector('#country_name').innerText = '↑'
    }

    table.querySelector('#area').innerText = sortColumn !== 'area' ? '↕' : '↑';
    table.querySelector('#area').innerText;
    if (sortColumn !== 'area') {
        table.querySelector('#area').innerText = '↕';
    } else if (reversed) {
        table.querySelector('#area').innerText = '↓';
    } else {
        table.querySelector('#area').innerText = '↑'
    }
}

function addElemTd(element, table) {
    const newTr = document.createElement('tr');
    newTr.innerHTML = `<td>${element.name}</td><td>${element.capital}</td>
                        <td>${element.region}</td>
                        <td>${Object.values(element.languages).join(', ')}</td>
                        <td>${element.area}</td>`
    table.tBodies[0].append(newTr);
}