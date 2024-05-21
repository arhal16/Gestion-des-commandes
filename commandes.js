$(document).ready(function() {
    // Charger les commandes depuis le stockage local
    loadOrders();

    $('#addOrderBtn').on('click', function() {
        Swal.fire({
            title: 'Ajouter une commande',
            html: `
                <input type="text" id="swal-input1" class="swal2-input" placeholder="Nom complet">
                <select id="swal-input2" class="swal2-input">
                    <option value="">Sélectionner un produit</option>
                    <option value="Produit 1">Produit 1</option>
                    <option value="Produit 2">Produit 2</option>
                </select>
                <input type="number" id="swal-input3" class="swal2-input" placeholder="Quantité">
                <input type="text" id="swal-input4" class="swal2-input" placeholder="Personnalisation">
                <input type="number" id="swal-input5" class="swal2-input" placeholder="Prix">
                <input type="number" id="swal-input6" class="swal2-input" placeholder="Avance">
                <input type="date" id="swal-input7" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const nomComplet = document.getElementById('swal-input1').value;
                const produit = document.getElementById('swal-input2').value;
                const quantite = document.getElementById('swal-input3').value;
                const personnalisation = document.getElementById('swal-input4').value;
                const prix = document.getElementById('swal-input5').value;
                const avance = document.getElementById('swal-input6').value;
                const date = document.getElementById('swal-input7').value;
                const reste = prix - avance;

                if (!nomComplet || !produit || !quantite || !prix || !avance || !date) {
                    Swal.showValidationMessage('Tous les champs sont obligatoires');
                    return false;
                }

                return { nomComplet, produit, quantite, personnalisation, prix, avance, reste, date };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newOrder = result.value;
                addOrderToTable(newOrder);
                saveOrder(newOrder);
            }
        });
    });

    function addOrderToTable(order, id) {
        const newRow = `
            <tr>
                <td>${id}</td>
                <td>${order.nomComplet}</td>
                <td>${order.produit}</td>
                <td>${order.quantite}</td>
                <td>${order.personnalisation}</td>
                <td>${order.prix} €</td>
                <td>${order.avance} €</td>
                <td>${order.reste} €</td>
                <td>${order.date}</td>
                <td><button class="delete-btn">Supprimer</button></td>
            </tr>
        `;
        $('#ordersTable tbody').append(newRow);
    }

    function saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.forEach((order, index) => {
            addOrderToTable(order, index + 1);
        });
    }

    function updateOrderIDs() {
        $('#ordersTable tbody tr').each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
    }

    $('#ordersTable').on('click', '.delete-btn', function() {
        const row = $(this).closest('tr');
        const index = row.index();
        row.remove();
        deleteOrder(index);
        updateOrderIDs();
    });

    function deleteOrder(index) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
});
