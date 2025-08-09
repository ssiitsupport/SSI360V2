using SSI360V2.Core.DTOs;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;

namespace SSI360V2.Application.Services;

public class TenantService : ITenantService
{
    private readonly ITenantRepository _tenantRepository;

    public TenantService(ITenantRepository tenantRepository)
    {
        _tenantRepository = tenantRepository;
    }

    public async Task<TenantDto> CreateTenantAsync(CreateTenantDto createTenantDto)
    {
        var existingTenant = await _tenantRepository.GetByDomainAsync(createTenantDto.Domain);
        if (existingTenant != null)
        {
            throw new InvalidOperationException("Tenant with this domain already exists");
        }

        var tenant = new Tenant
        {
            Name = createTenantDto.Name,
            Domain = createTenantDto.Domain,
            IsActive = createTenantDto.IsActive,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        var createdTenant = await _tenantRepository.AddAsync(tenant);
        return MapToTenantDto(createdTenant);
    }

    public async Task<TenantDto> UpdateTenantAsync(Guid id, UpdateTenantDto updateTenantDto)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id);
        if (tenant == null)
        {
            throw new InvalidOperationException("Tenant not found");
        }

        tenant.Name = updateTenantDto.Name;
        tenant.Domain = updateTenantDto.Domain;
        tenant.IsActive = updateTenantDto.IsActive;
        tenant.UpdatedAt = DateTime.UtcNow;
        tenant.UpdatedBy = "System";

        var updatedTenant = await _tenantRepository.UpdateAsync(tenant);
        return MapToTenantDto(updatedTenant);
    }

    public async Task<TenantDto> GetTenantByIdAsync(Guid id)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id);
        if (tenant == null)
        {
            throw new InvalidOperationException("Tenant not found");
        }

        return MapToTenantDto(tenant);
    }

    public async Task<TenantDto> GetTenantByDomainAsync(string domain)
    {
        var tenant = await _tenantRepository.GetByDomainAsync(domain);
        if (tenant == null)
        {
            throw new InvalidOperationException("Tenant not found");
        }

        return MapToTenantDto(tenant);
    }

    public async Task<PaginatedResult<TenantDto>> GetTenantsAsync(int page = 1, int pageSize = 10, string? search = null)
    {
        var tenants = await _tenantRepository.GetAllAsync();
        
        if (!string.IsNullOrEmpty(search))
        {
            tenants = tenants.Where(t => 
                t.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                t.Domain.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        var totalCount = tenants.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var pagedTenants = tenants
            .Skip((page - 1) * pageSize)
            .Take(pageSize);

        var tenantDtos = pagedTenants.Select(MapToTenantDto).ToList();

        return new PaginatedResult<TenantDto>
        {
            Items = tenantDtos,
            TotalCount = totalCount,
            TotalPages = totalPages,
            CurrentPage = page,
            PageSize = pageSize
        };
    }

    public async Task<TenantDto> GetCurrentTenantAsync()
    {
        // This would typically get the current tenant from the HTTP context
        // For now, we'll return the default tenant
        var tenant = await _tenantRepository.GetByDomainAsync("default");
        if (tenant == null)
        {
            throw new InvalidOperationException("Default tenant not found");
        }

        return MapToTenantDto(tenant);
    }

    private static TenantDto MapToTenantDto(Tenant tenant)
    {
        return new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Domain = tenant.Domain,
            IsActive = tenant.IsActive,
            CreatedAt = tenant.CreatedAt,
            UpdatedAt = tenant.UpdatedAt
        };
    }

    public async Task DeleteTenantAsync(Guid id)
    {
        await _tenantRepository.DeleteAsync(id);
    }
}
