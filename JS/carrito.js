let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

carrito = [];
localStorage.removeItem('carrito');

document.getElementById('gallery').addEventListener('click', e => {
  if (e.target.classList.contains('btn-agregar')) {
    const boton = e.target;
    const nombre = boton.getAttribute('data-nombre');
    const codigo = boton.getAttribute('data-codigo');
    const marca = boton.getAttribute('data-marca');
    const valor = parseFloat(boton.getAttribute('data-valor'));

    const index = carrito.findIndex(item => item.codigo === codigo);
    if (index >= 0) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ nombre, codigo, marca, valor, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }
});

function mostrarCarrito() {
  const tabla = document.getElementById('tabla-carrito').getElementsByTagName('tbody')[0];
  tabla.innerHTML = '';

  if (carrito.length === 0) {
    tabla.innerHTML = '<tr><td colspan="7" class="empty">El carrito está vacío</td></tr>';
    document.getElementById('total-carrito').textContent = '';
    document.getElementById('totalInput').value = 0;
    document.getElementById('paybtn').disabled = true;
    document.getElementById('paybtn').style.opacity = 0.45;
    return;
  }else{
    document.getElementById('paybtn').disabled = false;
    document.getElementById('paybtn').style.opacity = 1.00;
  }

  carrito.forEach((item, index) => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td class="prod-nombre">${item.nombre}</td>
      <td>${item.codigo}</td>
      <td>${item.marca}</td>
      <td>$${item.valor.toLocaleString()}</td>
      <td>${item.cantidad}</td>
      <td>$${(item.valor * item.cantidad).toLocaleString()}</td>
      <td></td>
    `;

    const btnMenos = document.createElement('button');
    btnMenos.classList.add("btn-menos");
    btnMenos.textContent = '-';
    btnMenos.addEventListener('click', () => {
      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        carrito.splice(index, 1);
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      mostrarCarrito();
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.style.marginLeft = '5px';
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener('click', () => {
      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      mostrarCarrito();
    });

    const acciones = document.createElement('div');
    acciones.appendChild(btnMenos);
    acciones.appendChild(btnEliminar);

    fila.lastElementChild.appendChild(acciones);
    tabla.appendChild(fila);
  });

  // Botones de logout o pagar
  document.getElementById('log-out').addEventListener('click', () => {
    carrito = [];
    localStorage.removeItem('carrito');
    sessionStorage.clear(); 
    window.location = "../index.html";
  });

  document.getElementById('pay')?.addEventListener('click', () => {
    carrito = [];
    localStorage.removeItem('carrito'); 
    mostrarCarrito();
  });

  let total = carrito.reduce((sum, item) => sum + (item.valor * item.cantidad), 0);
  document.getElementById('total-carrito').textContent = 'Total: $' + total.toLocaleString();
  document.getElementById('totalInput') && (document.getElementById('totalInput').value = total);
}

mostrarCarrito();
