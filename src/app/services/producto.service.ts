import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from '../modelo/producto.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url: any = `${environment.url}/productos.json`;

  constructor(private http: HttpClient) { }

  /**
   * 
   * @param producto 
   */
  guardarProducto(producto: Producto) {

    return this.http.post(this.url, producto);

  }

  /**
   * 
   */
  obtenerProductos() {
    return this.http.get(this.url)
      .pipe(
        map( this.arregloProducto )
      );
  }

  /**
   * Transforma la respuesta en un arreglo
   * @param prod 
   */
  arregloProducto(prod: any) {
    console.log("productos: ", prod);

    let productos : Producto[] = [];

    if( prod != null ) {

      Object.keys(prod).forEach( llave => {
        let producto: Producto = prod[llave];
        producto.id = llave;

        productos.push(producto);
      });
    }

    return productos;
  }

  /**
   * 
   * @param producto 
   * @returns 
   */
  actualizarProducto(producto: Producto) {
    console.log("Producto a actualizar: ", producto.id);
    const prodAux = {...producto};

    delete prodAux.id;

    return this.http.put(`${ environment.url}/productos/${ producto.id}.json`, prodAux);
  }


  /**
   * 
   * @param id 
   */
  eliminarProducto( id: any ) {

    return this.http.delete(`${ environment.url}/productos/${id}.json`)

  }


}
