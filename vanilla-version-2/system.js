const sector_selector_politics_btn = document.getElementById('sector-option-pol')
const sector_selector_economics_btn = document.getElementById('sector-option-eco')
const sector_selector_military_btn = document.getElementById('sector-option-mil')

const sector_selection_politics = document.getElementById('politic-option')
const sector_selection_economics = document.getElementById('economic-option')
const sector_selection_military = document.getElementById('military-option')

var hideAllSectorSelections = function() {
    sector_selection_politics.hidden = true;
    sector_selection_economics.hidden = true;
    sector_selection_military.hidden = true;
}

var selectSector = function(sector) {
    hideAllSectorSelections()
    sector.hidden = false;
}

sector_selector_politics_btn.addEventListener('click', (thing) => { selectSector(sector_selection_politics) })
sector_selector_economics_btn.addEventListener('click', (thing) => { selectSector(sector_selection_economics) })
sector_selector_military_btn.addEventListener('click', (thing) => { selectSector(sector_selection_military) })

selectSector(sector_selection_politics)
console.log(sector_selection_politics)