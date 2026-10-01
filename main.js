document.addEventListener('DOMContentLoaded', () => {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('invoiceDate').value = today;
            addRow();
        });

        function addRow(selectedInch = '', details = 'DD ST ', bundles = '', pricePerBundle = '', discount = '') {
            const tbody = document.getElementById('orderTableBody');
            const rowId = Date.now() + Math.random().toString(36).substr(2, 5);

            const inchesOptions = ['38"','37"','36"', '35"', '34"', '32"', '30"', '28"', '26"', '24"', '22"', '20"', '18"', '16"', '14"', '12"', '10"', '8"', '6"', '4"'];
            let optionsHTML = '<option value="">Length</option>';
            inchesOptions.forEach(opt => {
                const selected = opt === selectedInch ? 'selected' : '';
                optionsHTML += `<option value="${opt}" ${selected}>${opt}</option>`;
            });

            const tr = document.createElement('tr');
            tr.id = `row-${rowId}`;
            tr.className = "hover:bg-stone-50/80 transition-colors";

            tr.innerHTML = `
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                        <select class="row-inches w-24 bg-stone-50 border border-stone-200 rounded px-2.5 py-2 text-stone-800 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700">
                            ${optionsHTML}
                        </select>
                        <input type="text" placeholder="DD ST" value="${details}" 
                            class="row-details w-28 bg-stone-50 border border-stone-200 rounded px-2.5 py-2 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700">
                    </div>
                </td>
                <td class="py-3 px-4">
                    <input type="number" min="0" placeholder="0" value="${bundles}" 
                        class="row-bundles w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                        oninput="updateRowSubtotal('${rowId}')">
                </td>
                <td class="py-3 px-4">
                    <input type="number" step="0.01" min="0" placeholder="0.00" value="${pricePerBundle}" 
                        class="row-price w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                        oninput="updateRowSubtotal('${rowId}')">
                </td>
                <td class="py-3 px-4">
                    <input type="number" step="0.01" min="0" placeholder="0.00" value="${discount}" 
                        class="row-discount w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700"
                        oninput="updateRowSubtotal('${rowId}')">
                </td>
                <td class="py-3 px-4 text-right">
                    <input type="text" readonly placeholder="0.00" 
                        class="row-subtotal w-full bg-stone-100 border border-stone-200 rounded px-3 py-2 text-stone-800 font-semibold text-sm text-right focus:outline-none">
                </td>
                <td class="py-3 px-2 text-center no-print">
                    <button onclick="deleteRow('${rowId}')" title="Delete Row" class="text-stone-400 hover:text-red-600 p-2 rounded-lg transition-colors">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
            updateRowSubtotal(rowId);
        }
        function enter(){
        const name = document.getElementById("nameAd").value;
        const creds = document.getElementById("credsAd").value;
        
            if(name == "admin" && creds == "ElegantFH26"){
              document.getElementById("formMainPage").style.display = "none";
              document.getElementById("mainPage").style.display = "block";
            }
            else{
              document.getElementById("notif").style.display = "block";
            }

        } 
        function deleteRow(rowId) {
            const row = document.getElementById(`row-${rowId}`);
            if (row) {
                row.remove();
                calculateTotals();
            }
        }

        function updateRowSubtotal(rowId) {
            const row = document.getElementById(`row-${rowId}`);
            if (!row) return;

            const bundlesInput = row.querySelector('.row-bundles');
            const priceInput = row.querySelector('.row-price');
            const discountInput = row.querySelector('.row-discount');
            const subtotalInput = row.querySelector('.row-subtotal');

            const bundles = parseFloat(bundlesInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const discount = parseFloat(discountInput.value) || 0;
            
            const subtotal = Math.max(0, (bundles * price) - discount);

            subtotalInput.value = subtotal.toFixed(2);
            calculateTotals();
        }

        function calculateTotals() {
            const tbody = document.getElementById('orderTableBody');
            const rows = tbody.querySelectorAll('tr');
            
            let totalSubtotal = 0;
            let totalDiscount = 0;
            let totalBundles = 0;
            let totalItems = 0;

            rows.forEach(row => {
                const subtotalInput = row.querySelector('.row-subtotal');
                const bundlesInput = row.querySelector('.row-bundles');
                const discountInput = row.querySelector('.row-discount');
                
                const subVal = parseFloat(subtotalInput.value) || 0;
                const bundleVal = parseInt(bundlesInput.value) || 0;
                const discountVal = parseFloat(discountInput.value) || 0;

                totalSubtotal += subVal;
                totalDiscount += discountVal;
                totalBundles += bundleVal;
                totalItems += 1;
            });

            const shippingFee = parseFloat(document.getElementById('shippingFeeInput').value) || 0;
            const grandTotal = totalSubtotal + shippingFee;

            document.getElementById('totalItemsCount').textContent = totalItems;
            document.getElementById('totalBundlesCount').textContent = totalBundles;
            document.getElementById('totalDiscountDisplay').textContent = `$${totalDiscount.toFixed(2)}`;
            document.getElementById('grandTotalDisplay').textContent = `$${grandTotal.toFixed(2)}`;
        }

        function clearForm() {
            document.getElementById('buyerName').value = '';
            document.getElementById('buyerAddress').value = '';
            document.getElementById('shippingFeeInput').value = '0.00';
            document.getElementById('orderTableBody').innerHTML = '';
            addRow();
            calculateTotals();
        }

        function generatePDF() {
            window.print();
        }
