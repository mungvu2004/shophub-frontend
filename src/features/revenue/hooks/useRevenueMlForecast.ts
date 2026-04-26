import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { revenueMlForecastService } from '@/features/revenue/services/revenueMlForecastService'
import type {
  RevenueMlForecastComparisonScenario,
  RevenueMlForecastRangeDays,
  RevenueMlForecastScenarioInput,
} from '@/types/revenue.types'

export const useRevenueMlForecast = (days: RevenueMlForecastRangeDays = 30) => {
  const queryClient = useQueryClient()
  const [comparedScenarioIds, setComparedScenarioIds] = useState<string[]>(['baseline'])

  const forecastQuery = useQuery({
    queryKey: ['revenue', 'ml-forecast', days],
    queryFn: () => revenueMlForecastService.getForecast(days),
  })

  const comparisonQuery = useQuery({
    queryKey: ['revenue', 'ml-forecast', 'comparison'],
    queryFn: () => revenueMlForecastService.getComparisonScenarios(),
  })

  const simulateMutation = useMutation({
    mutationFn: (input: RevenueMlForecastScenarioInput) => revenueMlForecastService.simulateScenario(input),
    onSuccess: (newScenario) => {
      // Optimistically add to the comparison list
      queryClient.setQueryData<RevenueMlForecastComparisonScenario[]>(
        ['revenue', 'ml-forecast', 'comparison'],
        (old = []) => [...old, newScenario],
      )
      // Auto select the new scenario for comparison
      setComparedScenarioIds((prev) => [...prev, newScenario.id])
    },
  })

  const toggleComparison = (id: string) => {
    setComparedScenarioIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const comparedScenarios = (comparisonQuery.data || []).filter((s) => comparedScenarioIds.includes(s.id))

  return {
    forecast: forecastQuery.data,
    isLoading: forecastQuery.isLoading || comparisonQuery.isLoading,
    isError: forecastQuery.isError || comparisonQuery.isError,
    allScenarios: comparisonQuery.data || [],
    comparedScenarios,
    comparedScenarioIds,
    toggleComparison,
    simulate: simulateMutation.mutate,
    isSimulating: simulateMutation.isPending,
  }
}
