import { useState } from "react";
import { History as HistoryIcon, Calendar, Eye, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Sale } from "./PointOfSale";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SalesHistoryProps {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
}

export function SalesHistory({ sales, onDeleteSale }: SalesHistoryProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return "00:00";
  };

  const formatMonthYear = (date: string) => {
    return date.slice(0, 7);
  };

  const filteredSales = sales.filter((sale) => {
    const saleDateStr = sale.date; // "2026-01-02"

    if (filterDate && saleDateStr !== filterDate) {
      return false;
    }

    if (filterMonth) {
      const [year, month] = filterMonth.split('-').map(Number);
      const [saleYear, saleMonth] = saleDateStr.split('-').map(Number);
      if (saleYear !== year || saleMonth !== month) {
        return false;
      }
    }

    return true;
  });

  const sortedSales = [...filteredSales].sort(
    (a, b) => new Date(b.date + 'T12:00:00').getTime() - new Date(a.date + 'T12:00:00').getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2">
          <HistoryIcon className="h-6 w-6" />
          Historial de Ventas
        </h2>
        <p className="text-muted-foreground">
          Consulta todas las ventas realizadas
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filterDate">Filtrar por fecha</Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filterMonth">Filtrar por mes</Label>
              <Input
                id="filterMonth"
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </div>
          </div>
          {(filterDate || filterMonth) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setFilterDate("");
                setFilterMonth("");
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardContent className="p-0">
          {sortedSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {sales.length === 0
                  ? "No hay ventas registradas"
                  : "No se encontraron ventas con los filtros aplicados"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDate(sale.date)}</TableCell>
                      <TableCell>{formatTime(sale.date)}</TableCell>
                      <TableCell>
                        {sale.customerName ? sale.customerName : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {sale.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        items
                      </TableCell>
                      <TableCell className="capitalize">
                        {sale.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right">
                        ${sale.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSale(sale)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalle de Venta</DialogTitle>
                              </DialogHeader>
                              {selectedSale && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">
                                        Fecha:
                                      </p>
                                      <p>{formatDate(selectedSale.date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">
                                        Hora:
                                      </p>
                                      <p>{formatTime(selectedSale.date)}</p>
                                    </div>
                                    {selectedSale.customerName && (
                                      <div>
                                        <p className="text-muted-foreground">
                                          Cliente:
                                        </p>
                                        <p>{selectedSale.customerName}</p>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-muted-foreground">
                                        Método de pago:
                                      </p>
                                      <p className="capitalize">
                                        {selectedSale.paymentMethod}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Productos:
                                    </p>
                                    <div className="border rounded-lg divide-y">
                                      {selectedSale.items.map((item, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between p-3"
                                        >
                                          <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                              ${item.price.toFixed(2)} x{" "}
                                              {item.quantity}
                                            </p>
                                          </div>
                                          <p>
                                            ${(item.price * item.quantity).toFixed(2)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-4 border-t">
                                    <span>Total:</span>
                                    <span className="text-2xl">
                                      ${selectedSale.total.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteSale(sale.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
