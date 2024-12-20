

const FilterProductSelect = () => {

    return(
        <div className="">
            <form className="flex justify-between items-center" action="#" method="post">
                <div>
                    <h3 className="font-alt-font text-slate-600">Filters</h3>
                </div>

                <div className="border border-yellow-100">
                    <select className="px-4 py-2 text-slate-700 font-alt-font border-l-0 bg-white outline-0" name="#" id="#">
                        <option value=""> Price </option>
                        <option value="l100"> Less than 100 </option>
                        <option value="l200">Less than 200</option>
                        <option value="l300">Less than 300</option>
                    </select>
                </div>

                <div className="border border-yellow-100">
                    <select className="px-4 py-2  text-slate-700 font-alt-font border-l-0 bg-white outline-0" name="#" id="#">
                        <option value="cologne"> Perfume Type </option>
                        <option value="cologne">Cologne</option>
                        <option value="eau_de_toilette">Eau De Toilette</option>
                    </select>
                </div>

                <div className="border border-yellow-100">
                    <select className="px-4 py-2  text-slate-700 font-alt-font border-l-0 bg-white outline-0" name="#" id="#">
                        <option value="unisex"> Gender </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">unisex</option>
                    </select>
                </div>

            </form>
        </div>
    )
}

export default FilterProductSelect;