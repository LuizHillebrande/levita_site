'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">Páginas Institucionais</h1>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Páginas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Sobre a Empresa</h3>
                <p className="text-sm text-gray-600">Página institucional sobre a empresa</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


