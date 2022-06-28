import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Producto } from 'src/app/modelo/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  productoForm!: FormGroup;
  producto: Producto = new Producto();
  respuestaProd: any[] = [];


  constructor(private fb: FormBuilder, private productoServices: ProductoService) { }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.obtenerproductos();
  }

  iniciarFormulario() {
    this.productoForm = this.fb.group({
      nombre: [this.producto.nombre],
      cantidad: [this.producto.cantidad],
      descripcion: [this.producto.descripcion],
      id: [this.producto.id]
    })
  }

  guardar() {

    console.log(this.productoForm);

    if (this.producto.id) {
      this.actualizar();
    } else {
      // Guardar Producto
      this.producto = {
        nombre: this.productoForm.get('nombre')!.value,
        cantidad: this.productoForm.get('cantidad')!.value,
        descripcion: this.productoForm.get('descripcion')!.value
      }
      this.productoServices.guardarProducto(this.producto)
        .subscribe(respuesta => {
          console.log(respuesta);
          this.obtenerproductos();
          swal.fire({
            text: 'Guardado!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
        }, error => {
          this.mostrarError();
        })
    }

  }

  obtenerproductos() {
    this.productoServices.obtenerProductos()
      .subscribe(respuesta => {
        console.log("Lista de productos", respuesta);
        this.respuestaProd = respuesta;
      }, error => {
        this.mostrarError();
      })
  }

  mostrarError() {
    swal.fire({
      title: 'Error!',
      text: 'Algo anda mal. Intentalo nuevamente',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }

  modificarModelo(prod: any) {

    this.producto.id = prod.id;
    this.producto.nombre = prod.nombre;
    this.producto.cantidad = prod.cantidad;
    this.producto.descripcion = prod.descripcion;
    this.iniciarFormulario();

  }

  actualizar() {

    this.producto = {
      nombre: this.productoForm.get('nombre')!.value,
      cantidad: this.productoForm.get('cantidad')!.value,
      descripcion: this.productoForm.get('descripcion')!.value,
      id: this.productoForm.get('id')?.value
    }

    this.productoServices.actualizarProducto(this.producto)
      .subscribe(respuesta => {
        this.obtenerproductos();
        swal.fire({
          text: 'Actualizado!',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      }, error => {
        this.mostrarError();
      })
  }

  eliminar(prod: any) {
    swal.fire({
      title: 'Eliminar',
      text: "Vas a eliminar un registro",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServices.eliminarProducto(prod.id)
          .subscribe(respuesta => {
            this.obtenerproductos();
            swal.fire(
              '¡Eliminado!',
              'El registro se ha eliminado.',
              'success'
            )
          }, error => {
            this.mostrarError();
          })
      }
    })
  }

  limpiarModelo() {
    this.producto = {
      nombre: '',
      cantidad: 0,
      descripcion: '',
      id: ''
    }
    this.iniciarFormulario();
  }

}
