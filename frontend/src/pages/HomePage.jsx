import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableDemo } from "@/components/demo/DataTableDemo"
import { ChartDemo } from "@/components/demo/ChartDemo"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-foreground text-2xl font-bold">Library Management System</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <p className="text-muted-foreground">
          Frontend scaffold is running. Backend is at{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-sm">http://localhost:8000</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Palette</CardTitle>
          <CardDescription>A visualization of your active CSS variables.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md border bg-background text-foreground shadow-sm">
              <span className="text-xs font-semibold">Background</span>
            </div>
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <span className="text-xs font-semibold">Primary</span>
            </div>
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm">
              <span className="text-xs font-semibold">Secondary</span>
            </div>
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md bg-destructive text-destructive-foreground shadow-sm">
              <span className="text-xs font-semibold">Destructive</span>
            </div>
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md bg-muted text-muted-foreground shadow-sm">
              <span className="text-xs font-semibold">Muted</span>
            </div>
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md bg-accent text-accent-foreground shadow-sm">
              <span className="text-xs font-semibold">Accent</span>
            </div>
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-md border bg-card text-card-foreground shadow-sm">
              <span className="text-xs font-semibold">Card</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Start using shadcn/ui today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="flex gap-2">
              <Button variant="default">Standard</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Common questions about the library.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it styled with Tailwind?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern, powered by Radix UI.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simple Table</CardTitle>
            <CardDescription>A basic HTML table styled with Tailwind.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV002</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>Powered by TanStack React Table</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTableDemo />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartDemo />
      </div>
    </div>
  );
}
